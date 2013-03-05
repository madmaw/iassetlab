package com.iassetlab.core.frame.consumer;

import com.iassetlab.core.AssetContext;
import com.iassetlab.core.CompositeAssetContext;
import com.iassetlab.core.IAssetLabConstants;
import com.iassetlab.core.frame.FrameConsumer;
import com.iassetlab.core.frame.FrameConsumptionException;
import com.iassetlab.core.util.AssetContextHelper;
import com.iassetlab.core.util.FileFeatureUtil;
import org.apache.commons.lang.StringUtils;

import javax.imageio.ImageIO;
import java.awt.*;
import java.awt.image.BufferedImage;
import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;

/**
 * Created with IntelliJ IDEA.
 * User: chris
 * Date: 4/03/13
 * Time: 3:43 PM
 * To change this template use File | Settings | File Templates.
 */
public class SpriteSheetFrameConsumer extends AbstractFrameConsumer {

    private FrameConsumer aggregatedFrameConsumer;
    private List<BufferedImage> frames;
    private int width;
    private int height;
    private CompositeAssetContext assetContext;

    public SpriteSheetFrameConsumer(FrameConsumer aggregatedFrameConsumer) {
        this.aggregatedFrameConsumer = aggregatedFrameConsumer;
        this.frames = new ArrayList<>();
        this.width = 0;
        this.height = 0;
        this.assetContext = new CompositeAssetContext();
    }

    @Override
    public void consume(AssetContext context, InputStream frameData, String mimeType) throws IOException, FrameConsumptionException {
        BufferedImage frame = ImageIO.read(frameData);
        frames.add(frame);
        this.width += frame.getWidth();
        this.height = Math.max(this.height, frame.getHeight());
        this.assetContext.addAssetContext(context);
    }

    @Override
    public void close() throws IOException, FrameConsumptionException {
        // write everything to a single image
        BufferedImage result = new BufferedImage(this.width, this.height, BufferedImage.TYPE_INT_ARGB);

        // TODO build a sprite-map as well
        Graphics graphics = result.getGraphics();
        int x = 0;
        for( BufferedImage frame : this.frames ) {
            graphics.drawImage(frame, x, 0, null);
            x += frame.getWidth();
        }
        graphics.dispose();

        String resultFormatName = FileFeatureUtil.getOutputInformalFormatName(this.assetContext);
        String resultMimeType = FileFeatureUtil.getOutputMimeType(this.assetContext, FileFeatureUtil.MIME_TYPE_CLASS_IMAGE);

        ByteArrayOutputStream bos = new ByteArrayOutputStream();
        ImageIO.write(result, resultFormatName, bos);
        ByteArrayInputStream bis = new ByteArrayInputStream(bos.toByteArray());

        this.aggregatedFrameConsumer.consume(this.assetContext, bis, resultMimeType);
        this.aggregatedFrameConsumer.close();
    }

    @Override
    public Comparator<AssetContext> getComparator() {
        final Comparator<AssetContext> comparator = aggregatedFrameConsumer.getComparator();
        return new Comparator<AssetContext>() {
            @Override
            public int compare(AssetContext o1, AssetContext o2) {
                String g1 = AssetContextHelper.getString(o1, IAssetLabConstants.KEY_OUTPUT_SPRITE_SHEET_GROUP_NAME);
                String g2 = AssetContextHelper.getString(o2, IAssetLabConstants.KEY_OUTPUT_SPRITE_SHEET_GROUP_NAME);
                int result;
                if(g1 != null && g2 != null) {
                    result = g1.compareTo(g2);
                    if( result == 0 ) {
                        // the strings are equal, compare the times (although we don't care I guess)
                        result = DEFAULT_COMPARATOR.compare(o1, o2);
                    }
                } else if( g1 != null ) {
                    result = 1;
                } else if( g2 != null ) {
                    result = -1;
                } else {
                    result = 0;
                }
                if( result == 0 ) {
                    result = comparator.compare(o1, o2);
                }
                return result;
            }
        };
    }
}
