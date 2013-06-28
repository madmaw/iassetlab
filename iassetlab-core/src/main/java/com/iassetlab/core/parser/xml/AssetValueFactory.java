package com.iassetlab.core.parser.xml;

import com.iassetlab.core.AssetValue;
import com.iassetlab.core.DataPath;

/**
 * Created with IntelliJ IDEA.
 * User: chris
 * Date: 5/03/13
 * Time: 12:53 PM
 * To change this template use File | Settings | File Templates.
 */
public interface AssetValueFactory {
    AssetValue create(DataPath sourceDataPath, String nameTemplate, String valueTemplate, String type) throws InvalidAssetValueTemplateException;
}
