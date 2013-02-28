package com.iassetlab.core.frame;

import com.iassetlab.core.AssetContext;
import com.iassetlab.core.data.DataPath;

/**
 * Created with IntelliJ IDEA.
 * User: chris
 * Date: 28/02/13
 * Time: 9:55 AM
 * To change this template use File | Settings | File Templates.
 */
public interface FrameMetadataFactory {
    FrameMetadata create(DataPath systemPath, AssetContext context);
}
