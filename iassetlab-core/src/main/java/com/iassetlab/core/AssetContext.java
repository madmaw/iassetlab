package com.iassetlab.core;

import java.util.HashMap;
import java.util.Map;

/**
 * Created with IntelliJ IDEA.
 * User: chris
 * Date: 25/02/13
 * Time: 1:01 PM
 * To change this template use File | Settings | File Templates.
 */
public class AssetContext {
    private AssetContext parent;

    private Map<String, AssetValue> values;

    public AssetContext() {
        this.values = new HashMap<String, AssetValue>();
    }

    public AssetContext(AssetContext parent) {
        this();
        this.parent = parent;
    }

    public void set(String key, AssetValue value) {
        this.values.put(key, value);
    }

    public void setAll(Map<String, AssetValue> values) {
        this.values.putAll(values);
    }

    public Map<String, AssetValue> flatten() {
        Map<String, AssetValue> result;
        if( this.parent != null ) {
            result = this.parent.flatten();
            result.putAll(this.values);
        } else {
            result = new HashMap<>( this.values );
        }
        return result;
    }
}
