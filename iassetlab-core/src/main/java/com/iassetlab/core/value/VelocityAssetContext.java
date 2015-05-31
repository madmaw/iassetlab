package com.iassetlab.core.value;

import com.iassetlab.core.AssetContext;
import com.iassetlab.core.AssetValue;
import com.iassetlab.core.util.AssetContextHelper;
import org.apache.velocity.context.AbstractContext;
import org.apache.velocity.context.Context;

import java.util.Collection;
import java.util.HashMap;
import java.util.HashSet;
import java.util.Map;

/**
 * Created with IntelliJ IDEA.
 * User: chris
 * Date: 5/03/13
 * Time: 12:40 PM
 * To change this template use File | Settings | File Templates.
 */
public class VelocityAssetContext extends AbstractContext {

    private AssetContext assetContext;
    private Map<String, Object> internalVariables;

    public class NamedValue {
        private AssetValue value;
        private String ref;

        public NamedValue(AssetValue value, String ref) {
            this.value = value;
            this.ref = ref;
        }

        public String getValue() {
            if( value == null ) {
                throw new RuntimeException("missing value! "+ref);
            }
            return value.getValue(assetContext);
        }

        public String getName() {
            return value.getName(assetContext);
        }

        @Override
        public String toString() {
            return getValue();
        }
    };


    public VelocityAssetContext(AssetContext assetContext, Context context) {
        super(context);
        this.assetContext = assetContext;
        this.internalVariables = new HashMap<String, Object>();
    }

    @Override
    public Object internalGet(String s) {
        Object result = this.internalVariables.get(s);
        if( result == null ) {
            AssetValue value = this.assetContext.get(s);
            if( value != null ) {
                result = new NamedValue(value, s);
            }
        }
        return result;
    }

    @Override
    public Object internalPut(String s, Object o) {
        this.internalVariables.put(s, o);
        return o;
    }

    @Override
    public boolean internalContainsKey(Object o) {
        return this.assetContext.get(o.toString()) != null || this.internalVariables.containsKey(o);
    }

    @Override
    public Object[] internalGetKeys() {
        Collection<String> assetKeys = this.assetContext.getKeys();
        HashSet<String> keys = new HashSet<String>(assetKeys.size() + this.internalVariables.size());
        keys.addAll(assetKeys);
        keys.addAll(this.internalVariables.keySet());
        Object[] result = new Object[keys.size()];
        int pos = 0;
        for( String key : assetKeys ) {
            result[pos] = key;
            pos++;
        }
        return result;
    }

    @Override
    public Object internalRemove(Object o) {
        return this.internalVariables.remove(o);
    }
}
