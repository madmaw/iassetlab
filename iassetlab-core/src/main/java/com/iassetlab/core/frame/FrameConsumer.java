package com.iassetlab.core.frame;

import com.iassetlab.core.AssetContext;
import com.iassetlab.core.data.DataPath;

import java.io.IOException;
import java.io.InputStream;
import java.util.List;

/**
 * Created with IntelliJ IDEA.
 * User: chris
 * Date: 27/02/13
 * Time: 1:41 PM
 * To change this template use File | Settings | File Templates.
 */
public interface FrameConsumer {
    void consume(AssetContext context, InputStream frameData, String mimeType) throws IOException;

    void close();
}
