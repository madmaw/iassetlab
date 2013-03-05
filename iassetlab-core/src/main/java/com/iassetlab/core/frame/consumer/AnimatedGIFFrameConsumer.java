package com.iassetlab.core.frame.consumer;

import com.iassetlab.core.AssetContext;
import com.iassetlab.core.AssetValue;
import com.iassetlab.core.CompositeAssetContext;
import com.iassetlab.core.IAssetLabConstants;
import com.iassetlab.core.frame.FrameConsumer;
import com.iassetlab.core.frame.FrameConsumptionException;
import com.iassetlab.core.util.AnimatedGIFEncoder;
import com.iassetlab.core.util.AssetContextHelper;
import com.iassetlab.core.util.FileFeatureUtil;

import javax.imageio.ImageIO;
import java.awt.*;
import java.awt.image.BufferedImage;
import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.util.Comparator;

/**
 * Created with IntelliJ IDEA.
 * User: chris
 * Date: 4/03/13
 * Time: 2:07 PM
 * To change this template use File | Settings | File Templates.
 */
public class AnimatedGIFFrameConsumer implements FrameConsumer {

    private FrameConsumer storageConsumer;
    private AnimatedGIFEncoder animatedGIFEncoder;
    private float defaultDelta;
    private float previousTime;
    private CompositeAssetContext compositeAssetContext;
    private ByteArrayOutputStream gifData;
    private boolean started;

    public AnimatedGIFFrameConsumer(float defaultDelta, FrameConsumer storageConsumer) {
        this.animatedGIFEncoder = new AnimatedGIFEncoder();
        this.gifData = new ByteArrayOutputStream();
        this.started = false;
        this.previousTime = 0;
        this.defaultDelta = defaultDelta;
        this.storageConsumer = storageConsumer;
        this.compositeAssetContext = new CompositeAssetContext();
    }

    @Override
    public void consume(AssetContext context, InputStream frameData, String mimeType) throws FrameConsumptionException, IOException {
        BufferedImage bufferedImage = ImageIO.read(frameData);
        // frames are always delivered chronologically based on frame time (or animated gif frame time)
        String timeKey = IAssetLabConstants.KEY_OUTPUT_ANIMATED_GIF_FRAME_TIME;
        AssetValue timeValue = context.get(timeKey);
        if( timeValue == null ) {
            timeKey = IAssetLabConstants.KEY_OUTPUT_IMAGE_ANIMATION_TIME;
            timeValue = context.get(timeKey);
        }
        Float delta;
        if( timeValue != null ) {
            String timeString = timeValue.getValue(context);
            try {
                float time = Float.parseFloat(timeString);
                delta = time - previousTime;
                previousTime = time;
            } catch( NumberFormatException ex ) {
                throw new FrameConsumptionException("invalid value for "+timeKey+" "+timeString, ex);
            }
        } else {
            delta = null;
        }
        if( delta == null || delta <= 0 ) {
            AssetValue durationValue = context.get(IAssetLabConstants.KEY_OUTPUT_ANIMATED_GIF_FRAME_DURATION);
            if( durationValue != null ) {
                String durationString = durationValue.getValue(context);
                try {
                    delta = Float.parseFloat(durationString);
                } catch( NumberFormatException ex ) {
                    throw new FrameConsumptionException("invalid value for "+IAssetLabConstants.KEY_OUTPUT_ANIMATED_GIF_FRAME_DURATION+" "+durationString, ex);
                }
            } else {
                delta = this.defaultDelta;
            }
        }

        Color transparencyColor = AssetContextHelper.getColor(context, IAssetLabConstants.KEY_OUTPUT_GIF_TRANSPARENCY_COLOR);
        if( transparencyColor != null ) {
            BufferedImage image = new BufferedImage(bufferedImage.getWidth(), bufferedImage.getHeight(), BufferedImage.TYPE_INT_ARGB);
            Graphics graphics = image.getGraphics();
            graphics.setColor(transparencyColor);
            graphics.fillRect(0, 0, image.getWidth(), image.getHeight());
            graphics.drawImage(bufferedImage, 0, 0, null);
            graphics.dispose();
            bufferedImage = image;
            this.animatedGIFEncoder.setTransparent(transparencyColor);
        }
        AssetValue repeatValue = context.get(IAssetLabConstants.KEY_OUTPUT_ANIMATED_GIF_REPEAT);
        if( repeatValue != null ) {
            String repeatString = repeatValue.getValue(context);
            int repeat = Integer.parseInt(repeatString);
            this.animatedGIFEncoder.setRepeat(repeat);
        }
        if( !this.started ) {
            this.animatedGIFEncoder.start(this.gifData);
            this.started = true;
        }
        this.animatedGIFEncoder.setDelay((int)Math.round(delta * 1000));
        this.animatedGIFEncoder.addFrame(bufferedImage);
        this.compositeAssetContext.addAssetContext(context);

    }

    @Override
    public void close() throws IOException, FrameConsumptionException{
        this.animatedGIFEncoder.finish();
        ByteArrayInputStream gif = new ByteArrayInputStream(this.gifData.toByteArray());
        // write it to the storage consumer
        this.storageConsumer.consume(this.compositeAssetContext, gif, FileFeatureUtil.MIME_TYPE_GIF);
        this.storageConsumer.close();
    }

    @Override
    public Comparator<AssetContext> getComparator() {
        final Comparator<AssetContext> storageComparator = this.storageConsumer.getComparator();
        return new Comparator<AssetContext>() {
            @Override
            public int compare(AssetContext o1, AssetContext o2) {
                Double t1 = AssetContextHelper.getDouble(o1, IAssetLabConstants.KEY_OUTPUT_ANIMATED_GIF_FRAME_TIME);
                if( t1 == null ) {
                    t1 = AssetContextHelper.getDouble(o1, IAssetLabConstants.KEY_OUTPUT_IMAGE_ANIMATION_TIME);
                }
                Double t2 = AssetContextHelper.getDouble(o2, IAssetLabConstants.KEY_OUTPUT_ANIMATED_GIF_FRAME_TIME);
                if( t2 == null ) {
                    t2 = AssetContextHelper.getDouble(o2, IAssetLabConstants.KEY_OUTPUT_IMAGE_ANIMATION_TIME);
                }
                int result;
                if( t1 != null ) {
                    if( t2 != null ) {
                        if( t1 > t2 ) {
                            result = 1;
                        } else if( t1 < t2 ) {
                            result = -1;
                        } else {
                            result = storageComparator.compare(o1, o2);
                        }
                    } else {
                        result = 1;
                    }
                } else {
                    if( t2 != null ) {
                        result = -1;
                    } else {
                        result = storageComparator.compare(o1, o2);
                    }
                }
                return result;
            }
        };
    }
}
