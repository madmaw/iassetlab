package com.iassetlab.core;

/**
 * Created with IntelliJ IDEA.
 * User: chris
 * Date: 25/02/13
 * Time: 1:28 PM
 * To change this template use File | Settings | File Templates.
 */
public interface AssetValue {

    DataPath getSourceDataPath();

    String getValue(AssetContext context);

    String getName(AssetContext context);
}
