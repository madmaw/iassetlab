package com.iassetlab.core.parser.xml;

import com.iassetlab.core.AssetValue;

/**
 * Created with IntelliJ IDEA.
 * User: chris
 * Date: 5/03/13
 * Time: 12:53 PM
 * To change this template use File | Settings | File Templates.
 */
public interface AssetValueFactory {
    AssetValue create(String nameTemplate, String valueTemplate) throws InvalidAssetValueTemplateException;
}
