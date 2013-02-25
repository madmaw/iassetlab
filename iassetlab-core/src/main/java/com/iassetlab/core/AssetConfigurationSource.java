package com.iassetlab.core;

import java.util.List;
import java.util.Map;

/**
 * Created with IntelliJ IDEA.
 * User: chris
 * Date: 25/02/13
 * Time: 1:06 PM
 * To change this template use File | Settings | File Templates.
 */
public interface AssetConfigurationSource {
    List<Map<String, AssetValue>> build();
}
