package com.iassetlab.core.frame.transformer;

import com.iassetlab.core.AssetContext;
import com.iassetlab.core.DataPath;

import java.io.IOException;

/**
 * Created with IntelliJ IDEA.
 * User: chris
 * Date: 27/02/13
 * Time: 1:29 PM
 * To change this template use File | Settings | File Templates.
 */
public interface FrameTransformerFactory {
    FrameTransformer create(DataPath systemPath, AssetContext context) throws FrameTransformerConfigurationException, IOException;
}
