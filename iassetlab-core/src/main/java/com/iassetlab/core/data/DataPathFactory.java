package com.iassetlab.core.data;

import com.iassetlab.core.DataPath;

/**
 * Created with IntelliJ IDEA.
 * User: chris
 * Date: 28/02/13
 * Time: 7:22 PM
 * To change this template use File | Settings | File Templates.
 */
public interface DataPathFactory {
    DataPath getDataPath(String absolutePath);
}
