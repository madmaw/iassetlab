package com.iassetlab.core.util;

import com.iassetlab.core.AssetContext;
import com.iassetlab.core.AssetValue;

/**
 * Created with IntelliJ IDEA.
 * User: chris
 * Date: 4/03/13
 * Time: 6:43 PM
 * To change this template use File | Settings | File Templates.
 */
public class AssetContextHelper {

    public static final String getString(AssetContext assetContext, String key) {
        AssetValue value = assetContext.get(key);
        String result;
        if( value != null ) {
            result = value.getValue(assetContext);
        } else {
            result = null;
        }
        return result;
    }

    public static final Double getDouble(AssetContext assetContext, String key) {
        String value = getString(assetContext, key);
        Double result;
        if( value != null ) {
            result = new Double(value);
        } else {
            result = null;
        }
        return result;
    }

    public static final Integer getInteger(AssetContext assetContext, String key) {
        String value = getString(assetContext, key);
        Integer result;
        if( value != null ) {
            result = new Integer(value);
        } else {
            result = null;
        }
        return result;

    }

    private AssetContext assetContext;

    public AssetContextHelper(AssetContext assetContext) {
        this.assetContext = assetContext;
    }

    public String getString(String key) {
        return getString(this.assetContext, key);
    }

    public Double getDouble(String key) {
        return getDouble(this.assetContext, key);
    }

    public Integer getInteger(String key) {
        return getInteger(this.assetContext, key);
    }

}
