package com.iassetlab.core.frame.consumer;

import com.iassetlab.core.AssetContext;
import com.iassetlab.core.frame.FrameConsumer;

/**
 * Created with IntelliJ IDEA.
 * User: chris
 * Date: 4/03/13
 * Time: 7:34 PM
 * To change this template use File | Settings | File Templates.
 */
public interface FrameConsumerFactory {
    FrameConsumer create(AssetContext context);
}
