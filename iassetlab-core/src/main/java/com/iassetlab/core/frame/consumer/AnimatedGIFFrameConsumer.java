package com.iassetlab.core.frame.consumer;

import com.iassetlab.core.AssetContext;
import com.iassetlab.core.AssetValue;
import com.iassetlab.core.CompositeAssetContext;
import com.iassetlab.core.IAssetLabConstants;
import com.iassetlab.core.frame.FrameConsumer;
import com.iassetlab.core.frame.FrameConsumptionException;
import com.iassetlab.core.util.AnimatedGIFEncoder;
import com.iassetlab.core.util.FileFeatureUtil;

import javax.imageio.ImageIO;
import java.awt.image.BufferedImage;
import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.io.InputStream;

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
    private double defaultDelta;
    private float previousTime;
    private CompositeAssetContext compositeAssetContext;
    private ByteArrayOutputStream gifData;

    public AnimatedGIFFrameConsumer(double defaultDelta, FrameConsumer storageConsumer) {
        this.animatedGIFEncoder = new AnimatedGIFEncoder();
        this.gifData = new ByteArrayOutputStream();
        this.animatedGIFEncoder.start(this.gifData);
        this.previousTime = 0;
        this.defaultDelta = defaultDelta;
        this.storageConsumer = storageConsumer;
        this.compositeAssetContext = new CompositeAssetContext();
    }

    @Override
    public void consume(AssetContext context, InputStream frameData, String mimeType) throws FrameConsumptionException, IOException {
        BufferedImage bufferedImage = ImageIO.read(frameData);
        this.animatedGIFEncoder.addFrame(bufferedImage);
        // TODO there's no guarantee that this will come out in the right order, probably need to store and sort
        String timeKey = IAssetLabConstants.KEY_OUTPUT_ANIMATED_GIF_FRAME_TIME;
        AssetValue timeValue = context.get(timeKey);
        if( timeValue == null ) {
            timeKey = IAssetLabConstants.KEY_OUTPUT_IMAGE_ANIMATION_TIME;
            timeValue = context.get(timeKey);
        }
        double delta;
        if( timeValue != null ) {
            String timeString = timeValue.getValue(context);
            try {
                float time = Float.parseFloat(timeString);
                delta = time - previousTime;
                if( delta < 0 ) {
                    delta = 1;
                }
                previousTime = time;
            } catch( NumberFormatException ex ) {
                throw new FrameConsumptionException("invalid value for "+timeKey+" "+timeString, ex);
            }
        } else {
            AssetValue durationValue = context.get(IAssetLabConstants.KEY_OUTPUT_ANIMATED_GIF_FRAME_DURATION);
            if( durationValue != null ) {
                String durationString = durationValue.getValue(context);
                try {
                    delta = Double.parseDouble(durationString);
                } catch( NumberFormatException ex ) {
                    throw new FrameConsumptionException("invalid value for "+IAssetLabConstants.KEY_OUTPUT_ANIMATED_GIF_FRAME_DURATION+" "+durationString, ex);
                }
            } else {
                delta = this.defaultDelta;
            }
        }
        this.animatedGIFEncoder.addFrame(bufferedImage);
        this.animatedGIFEncoder.setDelay((int)Math.round(delta * 1000));
        this.compositeAssetContext.addAssetContext(context);

        AssetValue repeatValue = context.get(IAssetLabConstants.KEY_OUTPUT_ANIMATED_GIF_REPEAT);
        if( repeatValue != null ) {
            String repeatString = repeatValue.getValue(context);
            int repeat = Integer.parseInt(repeatString);
            this.animatedGIFEncoder.setRepeat(repeat);
        }
    }

    @Override
    public void close() throws IOException, FrameConsumptionException{
        this.animatedGIFEncoder.finish();
        ByteArrayInputStream gif = new ByteArrayInputStream(this.gifData.toByteArray());
        // write it to the storage consumer
        this.storageConsumer.consume(this.compositeAssetContext, gif, FileFeatureUtil.MIME_TYPE_GIF);
        this.storageConsumer.close();
    }
}
