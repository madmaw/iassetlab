package com.iassetlab.core.data;

import com.iassetlab.core.DataPath;

import java.io.IOException;
import java.io.InputStream;

/**
 * Created with IntelliJ IDEA.
 * User: chris
 * Date: 5/03/13
 * Time: 6:58 PM
 * To change this template use File | Settings | File Templates.
 */
public class ProtocolAwareDataPathProxy implements DataPath {

    private DataPath dataPath;
    private DataPathFactory dataPathFactory;
    private String protocol;

    public ProtocolAwareDataPathProxy(DataPath dataPath, DataPathFactory dataPathFactory, String protocol) {
        this.dataPath = dataPath;
        this.dataPathFactory = dataPathFactory;
        this.protocol = protocol;
    }

    @Override
    public InputStream open() throws IOException {
        return this.dataPath.open();
    }

    @Override
    public DataPath getRelativePath(String path) {
        int consIndex = path.indexOf(':');
        DataPath result;
        if( consIndex >= 0 ) {
            result = this.dataPathFactory.getDataPath(path);
        } else {
            result = this.dataPath.getRelativePath(path);
        }
        return result;
    }

    @Override
    public String toAbsolutePath() {
        return this.protocol + ":" + this.dataPath.toAbsolutePath();
    }
}
