package com.iassetlab.core.frame;

import com.iassetlab.core.AssetContext;

/**
 * Created with IntelliJ IDEA.
 * User: chris
 * Date: 27/02/13
 * Time: 1:29 PM
 * To change this template use File | Settings | File Templates.
 */
public interface FrameTransformerFactory {
    FrameTransformer create(AssetContext context);
}
