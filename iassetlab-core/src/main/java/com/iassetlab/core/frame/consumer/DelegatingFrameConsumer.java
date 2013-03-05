package com.iassetlab.core.frame.consumer;

import com.iassetlab.core.AssetContext;
import com.iassetlab.core.frame.FrameConsumer;
import com.iassetlab.core.frame.FrameConsumptionException;
import com.iassetlab.core.util.FileFeatureUtil;

import java.io.IOException;
import java.io.InputStream;
import java.util.*;

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
    private List<FrameConsumer> orderedFrameConsumers;

    public DelegatingFrameConsumer(FrameConsumerFactory frameConsumerFactory) {
        this.frameConsumerFactory = frameConsumerFactory;
        this.frameConsumers = new HashMap<>();
        this.orderedFrameConsumers = new ArrayList<>();
    }

    private FrameConsumer getFrameConsumer(AssetContext context) {
        String filename = FileFeatureUtil.getOutputFileName(context);
        FrameConsumer frameConsumer = this.frameConsumers.get(filename);
        if( frameConsumer == null ) {
            frameConsumer = this.frameConsumerFactory.create(context);
            this.frameConsumers.put(filename, frameConsumer);
        }
        return frameConsumer;
    }

    @Override
    public void consume(AssetContext context, InputStream frameData, String mimeType) throws IOException, FrameConsumptionException {
        FrameConsumer frameConsumer = getFrameConsumer(context);
        frameConsumer.consume(context, frameData, mimeType);
        if( !this.orderedFrameConsumers.contains(frameConsumer) ) {
            this.orderedFrameConsumers.add(frameConsumer);
        }
    }

    @Override
    public void close() throws IOException, FrameConsumptionException {
        for( FrameConsumer frameConsumer : this.orderedFrameConsumers ) {
            frameConsumer.close();
        }
    }

    @Override
    public Comparator<AssetContext> getComparator() {
        return new Comparator<AssetContext>() {
            @Override
            public int compare(AssetContext o1, AssetContext o2) {
                FrameConsumer f1 = getFrameConsumer(o1);
                FrameConsumer f2 = getFrameConsumer(o2);
                int result;
                if( f1 != f2 ) {
                    // assume we don't care
                    result = 0;
                } else {
                    result = f1.getComparator().compare(o1, o2);
                }
                return result;
            }
        };
    }
}
