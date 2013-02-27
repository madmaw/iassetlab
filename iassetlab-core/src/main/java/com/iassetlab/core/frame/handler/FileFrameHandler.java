package com.iassetlab.core.frame.handler;

import com.iassetlab.core.AssetContext;
import com.iassetlab.core.data.DataPath;
import com.iassetlab.core.frame.FrameHandler;

import java.io.File;
import java.io.IOException;
import java.io.InputStream;
import java.util.List;

/**
 * Created with IntelliJ IDEA.
 * User: chris
 * Date: 27/02/13
 * Time: 1:46 PM
 * To change this template use File | Settings | File Templates.
 */
public class FileFrameHandler implements FrameHandler {

    private File directory;

    public FileFrameHandler(File directory) {
        this.directory = directory;
    }

    @Override
    public void addFrame(AssetContext context, InputStream frameData) throws IOException {

    }

    @Override
    public void close() {

    }

    @Override
    public List<DataPath> getAssets() {
        return null;
    }
}
