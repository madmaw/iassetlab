package com.iassetlab.core;

import com.iassetlab.core.data.DataPath;

import java.util.Collection;
import java.util.HashMap;
import java.util.Map;

/**
 * Created with IntelliJ IDEA.
 * User: chris
 * Date: 4/03/13
 * Time: 4:09 PM
 * To change this template use File | Settings | File Templates.
 */
public class BasicAssetContext implements AssetContext {
    private Map<String, AssetValue> values;

    public BasicAssetContext() {
        this.values = new HashMap<>();
    }

    public BasicAssetContext(Map<String, AssetValue> values) {
        this.values = values;
    }

    public AssetValue get(String key) {
        AssetValue result = this.values.get(key);
        return result;
    }

    public void set(String key, AssetValue value) {
        this.values.put(key, value);
    }

    public void setAll(Map<String, AssetValue> values) {
        this.values.putAll(values);
    }

    public Collection<String> getKeys() {
        return this.values.keySet();
    }
}
