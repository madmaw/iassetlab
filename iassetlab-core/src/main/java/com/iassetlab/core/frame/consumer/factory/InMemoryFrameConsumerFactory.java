package com.iassetlab.core.frame.consumer.factory;

import com.iassetlab.core.AssetContext;
import com.iassetlab.core.frame.FrameConsumer;
import com.iassetlab.core.frame.consumer.FrameConsumerFactory;
import com.iassetlab.core.frame.consumer.InMemoryFrameConsumer;

import java.util.ArrayList;
import java.util.List;

/**
 * Created with IntelliJ IDEA.
 * User: chris
 * Date: 4/03/13
 * Time: 8:36 PM
 * To change this template use File | Settings | File Templates.
 */
public class InMemoryFrameConsumerFactory implements FrameConsumerFactory {

    private List<byte[]> frames;

    public InMemoryFrameConsumerFactory() {
        this.frames = new ArrayList<byte[]>();
    }

    @Override
    public FrameConsumer create(AssetContext context) {
        return new InMemoryFrameConsumer(this.frames);
    }

    public List<byte[]> getFrames() {
        return frames;
    }
}
