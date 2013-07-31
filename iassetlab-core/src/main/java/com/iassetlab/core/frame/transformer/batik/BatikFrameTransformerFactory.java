package com.iassetlab.core.frame.transformer.batik;

import com.iassetlab.core.AssetContext;
import com.iassetlab.core.AssetValue;
import com.iassetlab.core.IAssetLabConstants;
import com.iassetlab.core.DataPath;
import com.iassetlab.core.frame.transformer.FrameTransformer;
import com.iassetlab.core.frame.transformer.FrameTransformerConfigurationException;
import com.iassetlab.core.frame.transformer.FrameTransformerFactory;
import com.iassetlab.core.util.FileFeatureUtil;

import javax.imageio.ImageIO;
import java.awt.*;
import java.io.IOException;
import java.util.HashMap;

/**
 * Created with IntelliJ IDEA.                      `
 * User: chris
 * Date: 28/02/13
 * Time: 7:36 PM
 * To change this template use File | Settings | File Templates.
 */
public class BatikFrameTransformerFactory implements FrameTransformerFactory {

    private String defaultMimePrefix;
    private String defaultInformalName;

    public BatikFrameTransformerFactory(String defaultMimePrefix, String defaultInformalName) {
        this.defaultInformalName = defaultInformalName;
        this.defaultMimePrefix = defaultMimePrefix;
    }

    @Override
    public FrameTransformer create(DataPath dataPath, AssetContext context) throws FrameTransformerConfigurationException, IOException {

        AssetValue animationDurationValue = context.get(IAssetLabConstants.KEY_OUTPUT_IMAGE_ANIMATION_TIME);
        Float animationDuration;
        if( animationDurationValue != null ) {
            String animationDurationString = animationDurationValue.getValue(context);
            try {
                animationDuration = new Float(animationDurationString);
            } catch( NumberFormatException ex ) {
                throw new FrameTransformerConfigurationException("unable to parse animation duration "+animationDurationString, ex);
            }
        } else {
            animationDuration = null;
        }
        double scale = getDouble(context, IAssetLabConstants.KEY_OUTPUT_IMAGE_SCALE, 1D);
        Double scaleX = getDouble(context, IAssetLabConstants.KEY_OUTPUT_IMAGE_SCALE_X, null);
        Double scaleY = getDouble(context, IAssetLabConstants.KEY_OUTPUT_IMAGE_SCALE_Y, null);
        BatikFrameTransformer.Scaler scaler;
        if( scaleX != null || scaleY != null ) {
            final double scalerScaleX;
            if( scaleX == null ) {
                scalerScaleX = scale;
            } else {
                scalerScaleX = scaleX;
            }
            final double scalerScaleY;
            if( scaleY == null ) {
                scalerScaleY = scale;
            } else {
                scalerScaleY = scaleY;
            }
            scaler = new BatikFrameTransformer.Scaler() {
                @Override
                public double getXScale(int nativeWidth, int nativeHeight) {
                    return scalerScaleX;
                }

                @Override
                public double getYScale(int nativeWidth, int nativeHeight) {
                    return scalerScaleY;
                }
            };
        } else {
            // check for target width/height
            final Double scaleWidth = getDouble(context, IAssetLabConstants.KEY_OUTPUT_IMAGE_SCALE_WIDTH, null);
            final Double scaleHeight = getDouble(context, IAssetLabConstants.KEY_OUTPUT_IMAGE_SCALE_HEIGHT, null);
            if( scaleWidth != null && scaleHeight != null ) {
                scaler = new BatikFrameTransformer.Scaler() {
                    @Override
                    public double getXScale(int nativeWidth, int nativeHeight) {
                        return scaleWidth / ((double)nativeWidth);
                    }

                    @Override
                    public double getYScale(int nativeWidth, int nativeHeight) {
                        return scaleHeight / ((double)nativeHeight);
                    }
                };
            } else if( scaleWidth != null ) {
                scaler = new BatikFrameTransformer.Scaler() {
                    @Override
                    public double getXScale(int nativeWidth, int nativeHeight) {
                        return scaleWidth / ((double)nativeWidth);
                    }

                    @Override
                    public double getYScale(int nativeWidth, int nativeHeight) {
                        return getXScale(nativeWidth, nativeHeight);
                    }
                };
            } else if( scaleHeight != null ) {
                scaler = new BatikFrameTransformer.Scaler() {
                    @Override
                    public double getXScale(int nativeWidth, int nativeHeight) {
                        return getYScale(nativeWidth, nativeHeight);
                    }

                    @Override
                    public double getYScale(int nativeWidth, int nativeHeight) {
                        return scaleHeight / ((double)nativeHeight);
                    }
                };
            } else {
                scaler = new BatikFrameTransformer.Scaler() {
                    @Override
                    public double getXScale(int nativeWidth, int nativeHeight) {
                        return 1D;
                    }

                    @Override
                    public double getYScale(int nativeWidth, int nativeHeight) {
                        return 1D;
                    }
                };
            }
        }

        HashMap<RenderingHints.Key, Object> hintMap = new HashMap<>();
        // TODO make this configurable
        hintMap.put(RenderingHints.KEY_ANTIALIASING, RenderingHints.VALUE_ANTIALIAS_ON);
        hintMap.put(RenderingHints.KEY_STROKE_CONTROL, RenderingHints.VALUE_STROKE_NORMALIZE);
        hintMap.put(RenderingHints.KEY_ALPHA_INTERPOLATION, RenderingHints.VALUE_ALPHA_INTERPOLATION_QUALITY);
        hintMap.put(RenderingHints.KEY_RENDERING, RenderingHints.VALUE_RENDER_QUALITY);
        hintMap.put(RenderingHints.KEY_DITHERING, RenderingHints.VALUE_DITHER_ENABLE);
        hintMap.put(RenderingHints.KEY_COLOR_RENDERING, RenderingHints.VALUE_COLOR_RENDER_QUALITY);
        RenderingHints renderingHints = new RenderingHints(hintMap);

        String outputMimeType = FileFeatureUtil.getOutputMimeType(context, this.defaultMimePrefix);
        String outputInformalName = FileFeatureUtil.getOutputInformalFormatName(context);

        // validate against available informal names
        String[] availableSuffixes = ImageIO.getWriterFileSuffixes();
        boolean found = false;
        for( String availableSuffix : availableSuffixes ) {
            if(availableSuffix.equalsIgnoreCase(outputInformalName) ) {
                outputInformalName = availableSuffix;
                found = true;
                break;
            }
        }
        if( !found ) {
            throw new FrameTransformerConfigurationException("unsupported file suffix "+outputInformalName);
        }

        return new BatikFrameTransformer(
                animationDuration,
                scaler,
                renderingHints,
                outputMimeType,
                outputInformalName
        );
    }

    private static final Double getDouble(AssetContext context, String key, Double defaultValue) throws FrameTransformerConfigurationException {
        AssetValue value = context.get(key);
        Double result;
        if( value != null ) {
            String string = value.getValue(context);
            try {
                result = Double.parseDouble(string);
            } catch( NumberFormatException ex ) {
                throw new FrameTransformerConfigurationException("unable to parse "+key+" "+string, ex);
            }
        } else {
            result = defaultValue;
        }
        return result;
    }
}
