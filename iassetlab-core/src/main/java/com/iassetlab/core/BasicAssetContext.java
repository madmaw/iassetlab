package com.iassetlab.core;

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
        this.values = new HashMap<String, AssetValue>();
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

    @Override
    public String toString() {
        StringBuffer result = new StringBuffer(getClass().getName());
        result.append('{');
        for( Map.Entry<String, AssetValue> value : this.values.entrySet() ) {
            result.append(value.getKey()).append('=').append(value.getValue().toString()).append('\n');
        }
        result.append('}');
        return result.toString();
    }
}
