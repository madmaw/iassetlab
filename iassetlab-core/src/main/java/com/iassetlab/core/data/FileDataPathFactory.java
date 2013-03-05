package com.iassetlab.core.data;

import com.iassetlab.core.DataPath;

/**
 * Created with IntelliJ IDEA.
 * User: chris
 * Date: 5/03/13
 * Time: 4:51 PM
 * To change this template use File | Settings | File Templates.
 */
public class FileDataPathFactory implements DataPathFactory {

    private FileDataPath defaultDirectoryDataPath;

    public FileDataPathFactory(FileDataPath defaultDirectoryDataPath) {
        this.defaultDirectoryDataPath = defaultDirectoryDataPath;
    }

    @Override
    public DataPath getDataPath(String absolutePath) {
        return defaultDirectoryDataPath.getRelativePath(absolutePath);
    }
}
