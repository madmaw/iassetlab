package com.iassetlab.core.frame.metadata;

import com.iassetlab.core.AssetContext;
import com.iassetlab.core.AssetValue;
import com.iassetlab.core.data.DataPath;
import com.iassetlab.core.frame.FrameMetadata;
import com.iassetlab.core.frame.FrameMetadataFactory;

/**
 * Created with IntelliJ IDEA.
 * User: chris
 * Date: 1/03/13
 * Time: 5:40 PM
 * To change this template use File | Settings | File Templates.
 */
public class DataPathFrameMetadataFactory implements FrameMetadataFactory {

    private String assetValueKey;
    private String mimeType;
    private String defaultPath;

    public DataPathFrameMetadataFactory(String assetValueKey, String mimeType, String defaultPath) {
        this.assetValueKey = assetValueKey;
        this.mimeType = mimeType;
        this.defaultPath = defaultPath;
    }

    @Override
    public FrameMetadata create(DataPath systemPath, AssetContext context) {
        AssetValue assetValue = context.get(this.assetValueKey);
        String path;
        if( assetValue == null ) {
            path = this.defaultPath;
        } else {
            path = assetValue.getValue(context);
        }
        DataPath dataPath = systemPath.getRelativePath(path);
        return new FrameMetadata(this.mimeType, dataPath);
    }
}
