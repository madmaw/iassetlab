package com.iassetlab.core.value;

import com.iassetlab.core.AssetContext;
import com.iassetlab.core.AssetValue;
import com.iassetlab.core.DataPath;

/**
 * useful for known path-type things
 */
public class AbsolutePathAssetValueProxy implements AssetValue {

    private AssetValue proxied;

    public AbsolutePathAssetValueProxy(AssetValue proxied) {
        this.proxied = proxied;
    }

    @Override
    public DataPath getSourceDataPath() {
        return proxied.getSourceDataPath();
    }

    @Override
    public String getValue(AssetContext context) {
        String value = this.proxied.getValue(context);
        // convert this to an absolute path
        DataPath sourceDataPath = this.proxied.getSourceDataPath();
        DataPath relativeDataPath = sourceDataPath.getRelativePath(value);
        return relativeDataPath.toAbsolutePath();
    }

    @Override
    public String getName(AssetContext context) {
        return proxied.getName(context);
    }
}
