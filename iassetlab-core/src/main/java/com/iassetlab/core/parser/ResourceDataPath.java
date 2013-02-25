package com.iassetlab.core.parser;

import java.io.IOException;
import java.io.InputStream;

/**
 * Created with IntelliJ IDEA.
 * User: chris
 * Date: 25/02/13
 * Time: 4:52 PM
 * To change this template use File | Settings | File Templates.
 */
public class ResourceDataPath implements DataPath {

    private ClassLoader classLoader;
    private String path;

    public ResourceDataPath(ClassLoader classLoader, String path) {
        this.classLoader = classLoader;
        this.path = path;
    }

    @Override
    public InputStream open() throws IOException {
        return classLoader.getResourceAsStream(path);
    }

    @Override
    public DataPath getRelativePath(String path) {
        // assume we are always referencing a file (not a directory)
        int index = path.lastIndexOf('/');
        String relativePath;
        if( index <= 0 ) {
            relativePath = path;
        } else {
            String directory;
            directory = path.substring(0, index+1);
            relativePath = directory + path;
        }
        return new ResourceDataPath(this.classLoader, relativePath);
    }
}
