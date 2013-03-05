package com.iassetlab.core.parser.xml;

import com.iassetlab.core.AssetValue;
import com.iassetlab.core.DataPath;
import com.iassetlab.core.value.VelocityAssetValue;
import org.apache.velocity.app.VelocityEngine;

/**
 * Created with IntelliJ IDEA.
 * User: chris
 * Date: 5/03/13
 * Time: 1:12 PM
 * To change this template use File | Settings | File Templates.
 */
public class VelocityAssetValueFactory implements AssetValueFactory {

    private static VelocityAssetValueFactory INSTANCE;

    public static final VelocityAssetValueFactory getInstance()  {
        if( INSTANCE == null ) {
            INSTANCE = new VelocityAssetValueFactory(new VelocityEngine());
        }
        return INSTANCE;
    }

    private VelocityEngine velocityEngine;

    public VelocityAssetValueFactory(VelocityEngine velocityEngine) {
        this.velocityEngine = velocityEngine;
    }

    @Override
    public AssetValue create(DataPath sourceDataPath, String nameTemplate, String valueTemplate) throws InvalidAssetValueTemplateException {
        return new VelocityAssetValue(this.velocityEngine, sourceDataPath, nameTemplate, valueTemplate);
    }
}
