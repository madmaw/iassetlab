package com.iassetlab.core;

import java.util.Collection;
import java.util.HashSet;
import java.util.Map;

/**
 * Created with IntelliJ IDEA.
 * User: chris
 * Date: 4/03/13
 * Time: 4:11 PM
 * To change this template use File | Settings | File Templates.
 */
public class ChildAssetContext extends BasicAssetContext {

    private AssetContext parent;
    private String parentPrefix;

    public ChildAssetContext(AssetContext parent) {
        this(parent, (String)null);
    }

    public ChildAssetContext(AssetContext parent, String parentPrefix) {
        this.parent = parent;
        this.parentPrefix = parentPrefix;
    }

    public ChildAssetContext(AssetContext parent, Map<String, AssetValue> values) {
        this(parent, null, values);
    }

    public ChildAssetContext(AssetContext parent, String parentPrefix, Map<String, AssetValue> values) {
        super(values);
        this.parent = parent;
        this.parentPrefix = parentPrefix;
    }

    @Override
    public AssetValue get(String key) {
        AssetValue result = super.get(key);
        if( result == null ) {
            // can we get a prefixed key?
            if( this.parentPrefix != null ) {
                result = this.parent.get(this.parentPrefix+"."+key);
            }
            if( result == null && this.parent != null ) {
                result = this.parent.get(key);
            }
        }
        return result;
    }

    @Override
    public Collection<String> getKeys() {
        Collection<String> currentKeys = super.getKeys();
        Collection<String> parentKeys = this.parent.getKeys();
        HashSet<String> keys = new HashSet<String>(currentKeys.size() + parentKeys.size());
        keys.addAll(currentKeys);
        for( String parentKey : parentKeys ) {
            if( this.parentPrefix != null ) {
                keys.add(this.parentPrefix+"."+parentKey);
            } else {
                keys.add(parentKey);
            }
        }
        return keys;
    }
}
