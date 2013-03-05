package com.iassetlab.core.frame.consumer;

import com.iassetlab.core.AssetContext;
import com.iassetlab.core.IAssetLabConstants;
import com.iassetlab.core.frame.FrameConsumer;
import com.iassetlab.core.util.AssetContextHelper;

import java.util.Comparator;

/**
 * Created with IntelliJ IDEA.
 * User: chris
 * Date: 5/03/13
 * Time: 11:02 AM
 * To change this template use File | Settings | File Templates.
 */
public abstract class AbstractFrameConsumer implements FrameConsumer {

    protected static final Comparator<AssetContext> DEFAULT_COMPARATOR = new Comparator<AssetContext>() {
        @Override
        public int compare(AssetContext o1, AssetContext o2) {
            int result;
            Double t1 = AssetContextHelper.getDouble(o1, IAssetLabConstants.KEY_OUTPUT_IMAGE_ANIMATION_TIME);
            Double t2 = AssetContextHelper.getDouble(o2, IAssetLabConstants.KEY_OUTPUT_IMAGE_ANIMATION_TIME);
            if( t1 != null && t2 != null ) {
                if( t1 > t2 ) {
                    result = 1;
                } else if ( t1 < t2 ) {
                    result = -1;
                } else {
                    result = 0;
                }
            } else if( t1 != null ) {
                result = 1;
            } else if( t2 != null ) {
                result = -1;
            } else {
                result = 0;
            }
            return result;
        }
    };

    @Override
    public Comparator<AssetContext> getComparator() {
        return DEFAULT_COMPARATOR;
    }
}
