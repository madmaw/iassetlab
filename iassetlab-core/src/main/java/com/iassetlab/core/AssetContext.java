package com.iassetlab.core;

import com.iassetlab.core.data.DataPath;

import java.util.Collection;
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
    private String parentPrefix;
    private DataPath dataPath;

    private Map<String, AssetValue> values;

    public AssetContext() {
        this((AssetContext)null);
    }

    public AssetContext(AssetContext parent) {
        this(parent, (String)null);

    }

    public AssetContext(AssetContext parent, String parentPrefix) {
        this(parent, new HashMap<String, AssetValue>());
        this.parentPrefix = parentPrefix;
    }

    public AssetContext(Map<String, AssetValue> values) {
        this(null, values);
    }

    public AssetContext(AssetContext parent, Map<String, AssetValue> values) {
        this.parent = parent;
        this.values = values;
    }

    public AssetValue get(String key) {
        AssetValue result = this.values.get(key);
        if( result == null ) {
            // can we get a prefixed key?
            if( this.parentPrefix != null ) {
                result = this.parent.get(this.parentPrefix+"."+key);
            }
            if( result == null ) {
                result = this.parent.get(key);
            }
        }
        return result;
    }

    public void set(String key, AssetValue value) {
        this.values.put(key, value);
    }

    public void setAll(Map<String, AssetValue> values) {
        this.values.putAll(values);
    }

    public Collection<String> getKeys() {
        // TODO add parent keys
        // TODO remove prefix from parent keys
        return this.values.keySet();
    }
}
