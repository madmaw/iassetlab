package com.iassetlab.core;

import java.util.ArrayList;
import java.util.Collection;
import java.util.HashSet;
import java.util.List;

/**
 * Created with IntelliJ IDEA.
 * User: chris
 * Date: 4/03/13
 * Time: 4:21 PM
 * To change this template use File | Settings | File Templates.
 */
public class CompositeAssetContext implements AssetContext {

    public List<AssetContext> assetContexts;

    public CompositeAssetContext() {
        this.assetContexts = new ArrayList<AssetContext>();
    }

    public void addAssetContext(AssetContext assetContext) {
        this.assetContexts.add(assetContext);
    }

    @Override
    public AssetValue get(String key) {
        AssetValue result = null;
        for( AssetContext assetContext : this.assetContexts ) {
            result = assetContext.get(key);
            if( result != null ) {
                break;
            }
        }
        return result;
    }

    @Override
    public Collection<String> getKeys() {
        HashSet<String> result = new HashSet<String>();
        for( AssetContext assetContext : this.assetContexts ) {
            Collection<String> partKeys = assetContext.getKeys();
            result.addAll(partKeys);
        }
        return result;
    }
}
