package com.iassetlab.core.value;

import com.iassetlab.core.AssetContext;
import com.iassetlab.core.AssetValue;
import com.iassetlab.core.DataPath;

import java.util.List;
import java.util.Map;

/**
 * Created with IntelliJ IDEA.
 * User: chris
 * Date: 25/02/13
 * Time: 12:42 PM
 * To change this template use File | Settings | File Templates.
 */
public class SimpleAssetValue implements AssetValue {
    private String key;
    private String name;
    private String value;
    private DataPath sourceDataPath;

    public SimpleAssetValue(DataPath sourceDataPath, String key, String name, String value) {
        this.sourceDataPath = sourceDataPath;
        this.key = key;
        this.name = name;
        this.value = value;
    }

    @Override
    public DataPath getSourceDataPath() {
        return this.sourceDataPath;
    }

    public String getKey() {
        return key;
    }

    @Override
    public String getValue(AssetContext context) {
        return this.value;
    }

    @Override
    public String getName(AssetContext context) {
        return this.name;
    }

    @Override
    public String toString() {
        return this.value;
    }
}
