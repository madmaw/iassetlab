package com.iassetlab.core.frame.consumer;

import com.iassetlab.core.AssetContext;
import com.iassetlab.core.frame.FrameConsumer;
import com.iassetlab.core.frame.FrameConsumptionException;
import org.apache.commons.io.IOUtils;

import java.io.IOException;
import java.io.InputStream;
import java.util.*;

/**
 * Created with IntelliJ IDEA.
 * User: chris
 * Date: 1/03/13
 * Time: 4:26 PM
 * To change this template use File | Settings | File Templates.
 */
public class InMemoryFrameConsumer extends AbstractFrameConsumer {

    private List<byte[]> frames;

    public InMemoryFrameConsumer() {
        this.frames = new ArrayList<byte[]>();
    }

    public InMemoryFrameConsumer(List<byte[]> frames) {
        this.frames = frames;
    }

    @Override
    public void consume(AssetContext context, InputStream frameData, String mimeType) throws IOException {
        // get the name
        byte[] frame = IOUtils.toByteArray(frameData);
        frames.add(frame);
    }

    @Override
    public void close() {
        // do nothing
    }

    public List<byte[]> getFrames() {
        return this.frames;
    }

    @Override
    public boolean isFirst(AssetContext context) throws FrameConsumptionException {
        return frames.size() == 0;
    }
}
