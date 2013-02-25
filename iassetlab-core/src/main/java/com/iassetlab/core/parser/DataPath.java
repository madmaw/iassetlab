package com.iassetlab.core.parser;

import java.io.IOException;
import java.io.InputStream;

/**
 * Created with IntelliJ IDEA.
 * User: chris
 * Date: 25/02/13
 * Time: 3:32 PM
 * To change this template use File | Settings | File Templates.
 */
public interface DataPath {
    InputStream open() throws IOException;

    DataPath getRelativePath(String path);
}
