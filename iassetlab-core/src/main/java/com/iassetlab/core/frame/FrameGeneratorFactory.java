package com.iassetlab.core.frame;

import com.iassetlab.core.AssetContext;

/**
 * Created with IntelliJ IDEA.
 * User: chris
 * Date: 27/02/13
 * Time: 12:45 PM
 * To change this template use File | Settings | File Templates.
 */
public interface FrameGeneratorFactory {
    FrameGenerator create(AssetContext assetContext);
}
