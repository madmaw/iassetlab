package com.iassetlab.core.frame.consumer;

import com.iassetlab.core.AssetContext;
import com.iassetlab.core.frame.FrameConsumer;
import com.iassetlab.core.frame.FrameConsumptionException;
import com.iassetlab.core.util.FileFeatureUtil;

import java.io.IOException;
import java.io.InputStream;
import java.util.HashMap;
import java.util.Map;

/**
 * Created with IntelliJ IDEA.
 * User: chris
 * Date: 4/03/13
 * Time: 7:13 PM
 * To change this template use File | Settings | File Templates.
 */
public class DelegatingFrameConsumer implements FrameConsumer {

    private FrameConsumerFactory frameConsumerFactory;
    private Map<String, FrameConsumer> frameConsumers;

    public DelegatingFrameConsumer(FrameConsumerFactory frameConsumerFactory) {
        this.frameConsumerFactory = frameConsumerFactory;
        this.frameConsumers = new HashMap<>();
    }

    @Override
    public void consume(AssetContext context, InputStream frameData, String mimeType) throws IOException, FrameConsumptionException {
        String filename = FileFeatureUtil.getOutputFileName(context);
        FrameConsumer frameConsumer = this.frameConsumers.get(filename);
        if( frameConsumer == null ) {
            frameConsumer = this.frameConsumerFactory.create(context);
            this.frameConsumers.put(filename, frameConsumer);
        }
        frameConsumer.consume(context, frameData, mimeType);
    }

    @Override
    public void close() throws IOException, FrameConsumptionException {
        for( FrameConsumer frameConsumer : frameConsumers.values() ) {
            frameConsumer.close();
        }
    }
}
