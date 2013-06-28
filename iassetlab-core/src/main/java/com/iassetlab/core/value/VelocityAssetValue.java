package com.iassetlab.core.value;

import com.iassetlab.core.AssetContext;
import com.iassetlab.core.AssetValue;
import com.iassetlab.core.DataPath;
import org.apache.velocity.VelocityContext;
import org.apache.velocity.app.VelocityEngine;
import org.apache.velocity.context.Context;

import java.io.StringWriter;

/**
 * Created with IntelliJ IDEA.
 * User: chris
 * Date: 5/03/13
 * Time: 12:33 PM
 * To change this template use File | Settings | File Templates.
 */
public class VelocityAssetValue implements AssetValue {

    private VelocityEngine velocityEngine;
    private DataPath sourceDataPath;
    private String valueTemplate;
    private String nameTemplate;
    private String type;
    private Context globalContext;

    public VelocityAssetValue(
            VelocityEngine velocityEngine,
            Context globalContext,
            DataPath sourceDataPath,
            String nameTemplate,
            String valueTemplate,
            String type
    ) {
        this.velocityEngine = velocityEngine;
        this.sourceDataPath = sourceDataPath;
        this.valueTemplate = valueTemplate;
        this.nameTemplate = nameTemplate;
        this.type = type;
        this.globalContext = globalContext;
    }

    @Override
    public DataPath getSourceDataPath() {
        return this.sourceDataPath;
    }

    @Override
    public String getValue(AssetContext context) {
        // evaluate
        StringWriter sw = new StringWriter();
        VelocityAssetContext velocityContext = new VelocityAssetContext(context, this.globalContext);
        //VelocityContext c = new VelocityContext(velocityContext);
        velocityContext.put("v", "sadf");
        try {
            this.velocityEngine.evaluate(velocityContext, sw, VelocityAssetValue.class.getSimpleName(), this.valueTemplate);
        } catch( RuntimeException ex ) {
            throw new RuntimeException("unable to execute template "+this.valueTemplate, ex);
        }
        String result = sw.toString();

        if( "int".equals(type) ) {
            try {
                double i = Double.parseDouble(result);
                result = Long.toString(Math.round(i));
            } catch( Exception ex ) {
                throw new RuntimeException("unable to parse value "+result+" to "+type+" of from template "+this.valueTemplate);
            }
        }

        return result;
    }

    @Override
    public String getName(AssetContext context) {
        // evaluate
        StringWriter sw = new StringWriter();
        VelocityAssetContext velocityContext = new VelocityAssetContext(context, this.globalContext);
        this.velocityEngine.evaluate(velocityContext, sw, VelocityAssetValue.class.getSimpleName(), this.nameTemplate);
        return sw.toString();
    }

    @Override
    public String toString() {
        return this.valueTemplate;
    }
}
