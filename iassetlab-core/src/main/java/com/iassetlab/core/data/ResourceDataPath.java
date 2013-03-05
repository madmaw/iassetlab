package com.iassetlab.core.data;

import com.iassetlab.core.DataPath;

import java.io.FileNotFoundException;
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
        InputStream inputStream = classLoader.getResourceAsStream(path);
        if( inputStream == null ) {
            throw new FileNotFoundException(this.path);
        }
        return inputStream;
    }

    @Override
    public DataPath getRelativePath(String path) {
        // assume we are always referencing a file (not a directory)
        int index = this.path.lastIndexOf('/');
        String relativePath;
        if( index < 0 ) {
            relativePath = path;
        } else {
            String directory;
            directory = this.path.substring(0, index+1);
            relativePath = directory + path;
        }
        return new ResourceDataPath(this.classLoader, relativePath);
    }

    @Override
    public String toAbsolutePath() {
        return this.path;
    }

    public String toString() {
        return this.path;
    }
}
