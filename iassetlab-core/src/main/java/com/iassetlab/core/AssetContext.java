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
public interface AssetContext {
    AssetValue get(String key);

    Collection<String> getKeys();
}
