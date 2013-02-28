package com.iassetlab.core.frame.transformer;

import com.iassetlab.core.frame.FrameMetadata;

import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;

/**
 * Created with IntelliJ IDEA.
 * User: chris
 * Date: 27/02/13
 * Time: 1:27 PM
 * To change this template use File | Settings | File Templates.
 */
public interface FrameTransformer {
    FrameMetadata transform(InputStream inputStream, FrameMetadata inputMetadata, OutputStream outputStream) throws IOException, FrameTransformationException;
}
