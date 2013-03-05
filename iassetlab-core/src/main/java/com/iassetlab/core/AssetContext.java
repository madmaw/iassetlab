package com.iassetlab.core;

import java.util.Collection;

/**
 * Created with IntelliJ IDEA.
 * User: chris
 * Date: 25/02/13
 * Time: 1:01 PM
 * To change this template use File | Settings | File Templates.
 */
public interface AssetContext {
    AssetValue get(String key);

    Collection<String> getKeys();
}
