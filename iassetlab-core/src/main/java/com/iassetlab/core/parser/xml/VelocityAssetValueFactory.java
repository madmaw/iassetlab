package com.iassetlab.core.parser.xml;

import com.iassetlab.core.AssetValue;
import com.iassetlab.core.DataPath;
import com.iassetlab.core.value.VelocityAssetValue;
import org.apache.velocity.VelocityContext;
import org.apache.velocity.app.VelocityEngine;
import org.apache.velocity.context.Context;
import org.apache.velocity.tools.generic.MathTool;

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
            VelocityContext context = new VelocityContext();
            context.put("math", new MathTool());
            VelocityEngine engine = new VelocityEngine();
            engine.init();
            INSTANCE = new VelocityAssetValueFactory(engine, context);
        }
        return INSTANCE;
    }

    private VelocityEngine velocityEngine;
    private Context globalContext;

    public VelocityAssetValueFactory(VelocityEngine velocityEngine, Context globalContext) {
        this.velocityEngine = velocityEngine;
        this.globalContext = globalContext;
    }

    @Override
    public AssetValue create(DataPath sourceDataPath, String nameTemplate, String valueTemplate, String type) throws InvalidAssetValueTemplateException {
        return new VelocityAssetValue(this.velocityEngine, this.globalContext, sourceDataPath, nameTemplate, valueTemplate, type);
    }
}
