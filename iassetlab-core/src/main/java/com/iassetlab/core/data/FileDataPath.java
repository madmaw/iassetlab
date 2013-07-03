package com.iassetlab.core.data;

import com.iassetlab.core.DataPath;

import java.io.*;

/**
 * Created with IntelliJ IDEA.
 * User: chris
 * Date: 5/03/13
 * Time: 4:51 PM
 * To change this template use File | Settings | File Templates.
 */
public class FileDataPath implements DataPath {

    private File file;

    public FileDataPath(File file) {
        this.file = file;
    }

    @Override
    public InputStream open() throws IOException {
        if( !file.exists() ) {
            throw new FileNotFoundException(file.getAbsolutePath());
        }
        return new FileInputStream(this.file);
    }

    @Override
    public DataPath getRelativePath(String path) {
        File relativeFile;
        if( path.startsWith("/") ) {
            relativeFile = new File(path);
        } else {
            File directory;
            if( this.file.isDirectory() ) {
                directory = this.file;
            } else {
                directory = this.file.getParentFile();
            }
            relativeFile = new File(directory, path);
        }
        return new FileDataPath(relativeFile);
    }

    @Override
    public String toAbsolutePath() {
        return this.file.toURI().toString();
    }
}
