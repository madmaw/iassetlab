package com.iassetlab.core.value;

import com.iassetlab.core.AssetContext;
import com.iassetlab.core.AssetValue;
import org.apache.velocity.VelocityContext;
import org.apache.velocity.app.VelocityEngine;

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
    private String valueTemplate;
    private String nameTemplate;

    public VelocityAssetValue(VelocityEngine velocityEngine, String nameTemplate, String valueTemplate) {
        this.velocityEngine = velocityEngine;
        this.valueTemplate = valueTemplate;
        this.nameTemplate = nameTemplate;
    }


    @Override
    public String getValue(AssetContext context) {
        // evaluate
        StringWriter sw = new StringWriter();
        VelocityAssetContext velocityContext = new VelocityAssetContext(context);
        this.velocityEngine.evaluate(velocityContext, sw, VelocityAssetValue.class.getSimpleName(), this.valueTemplate);
        return sw.toString();
    }

    @Override
    public String getName(AssetContext context) {
        // evaluate
        StringWriter sw = new StringWriter();
        VelocityAssetContext velocityContext = new VelocityAssetContext(context);
        this.velocityEngine.evaluate(velocityContext, sw, VelocityAssetValue.class.getSimpleName(), this.nameTemplate);
        return sw.toString();
    }

    @Override
    public String toString() {
        return this.valueTemplate;
    }
}
