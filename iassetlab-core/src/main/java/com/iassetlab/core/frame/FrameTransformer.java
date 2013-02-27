package com.iassetlab.core.frame;

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
    void transform(InputStream inputStream, OutputStream outputStream) throws IOException;
}
