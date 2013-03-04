package com.iassetlab.core.frame.consumer;

import com.iassetlab.core.AssetContext;
import com.iassetlab.core.CompositeAssetContext;
import com.iassetlab.core.frame.FrameConsumer;
import com.iassetlab.core.frame.FrameConsumptionException;
import com.iassetlab.core.util.FileFeatureUtil;

import javax.imageio.ImageIO;
import java.awt.*;
import java.awt.image.BufferedImage;
import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.util.ArrayList;
import java.util.List;

/**
 * Created with IntelliJ IDEA.
 * User: chris
 * Date: 4/03/13
 * Time: 3:43 PM
 * To change this template use File | Settings | File Templates.
 */
public class SpriteSheetFrameConsumer implements FrameConsumer {

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
}
