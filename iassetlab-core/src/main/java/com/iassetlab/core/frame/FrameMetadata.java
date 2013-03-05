package com.iassetlab.core.frame;

import com.iassetlab.core.DataPath;

/**
 * Created with IntelliJ IDEA.
 * User: chris
 * Date: 28/02/13
 * Time: 9:46 AM
 * To change this template use File | Settings | File Templates.
 */
public class FrameMetadata {
    private String mimeType;
    private DataPath dataPath;

    public FrameMetadata(String mimeType, DataPath dataPath) {
        this.mimeType = mimeType;
        this.dataPath = dataPath;
    }

    public String getMimeType() {
        return mimeType;
    }

    public DataPath getDataPath() {
        return dataPath;
    }
}
