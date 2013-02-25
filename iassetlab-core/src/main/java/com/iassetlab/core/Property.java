package com.iassetlab.core;

import java.util.List;
import java.util.Map;

/**
 * Created with IntelliJ IDEA.
 * User: chris
 * Date: 25/02/13
 * Time: 12:42 PM
 * To change this template use File | Settings | File Templates.
 */
public class Property implements AssetValue {
    private String key;
    private String name;
    private String value;

    public Property(String key, String name, String value) {
        this.key = key;
        this.name = name;
        this.value = value;
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
}
