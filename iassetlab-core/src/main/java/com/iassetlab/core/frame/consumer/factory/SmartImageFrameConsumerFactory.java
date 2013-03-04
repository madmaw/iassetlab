package com.iassetlab.core.frame.consumer.factory;

import com.iassetlab.core.AssetContext;
import com.iassetlab.core.IAssetLabConstants;
import com.iassetlab.core.frame.FrameConsumer;
import com.iassetlab.core.frame.consumer.AnimatedGIFFrameConsumer;
import com.iassetlab.core.frame.consumer.FrameConsumerFactory;
import com.iassetlab.core.frame.consumer.SpriteSheetFrameConsumer;
import com.iassetlab.core.util.AssetContextHelper;
import com.iassetlab.core.util.FileFeatureUtil;

/**
 * Created with IntelliJ IDEA.
 * User: chris
 * Date: 4/03/13
 * Time: 7:50 PM
 * To change this template use File | Settings | File Templates.
 */
public class SmartImageFrameConsumerFactory implements FrameConsumerFactory {

    private FrameConsumerFactory storageConsumerFactory;

    public SmartImageFrameConsumerFactory(FrameConsumerFactory storageConsumerFactory) {
        this.storageConsumerFactory = storageConsumerFactory;
    }

    @Override
    public FrameConsumer create(AssetContext context) {
        String mimeType = FileFeatureUtil.getOutputMimeType(context);
        String suppressAnimations = AssetContextHelper.getString(context, IAssetLabConstants.KEY_OUTPUT_ANIMATION_SUPPRESS);
        FrameConsumer result;
        FrameConsumer storageConsumer = storageConsumerFactory.create(context);
        if( FileFeatureUtil.MIME_TYPE_GIF.equals(mimeType) && !Boolean.TRUE.toString().equalsIgnoreCase(suppressAnimations) ) {
            result = new AnimatedGIFFrameConsumer(1, storageConsumer);
        } else if( FileFeatureUtil.isBinaryImageMimeType(mimeType) ) {
            result = new SpriteSheetFrameConsumer(storageConsumer);
        } else {
            // use the storage frame consumer
            result = storageConsumer;
        }
        return result;
    }
}
