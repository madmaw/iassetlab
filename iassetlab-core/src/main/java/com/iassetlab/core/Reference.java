package com.iassetlab.core;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * Created with IntelliJ IDEA.
 * User: chris
 * Date: 25/02/13
 * Time: 12:49 PM
 * To change this template use File | Settings | File Templates.
 */
public class Reference implements AssetConfigurationSource {
    private String key;
    private String prefix;
    private ConfigurationTree configuration;

    public Reference(String key, String prefix, ConfigurationTree configuration) {
        this.key = key;
        this.prefix = prefix;
        this.configuration = configuration;
    }

    public String getKey() {
        return key;
    }

    public String getPrefix() {
        return prefix;
    }

    public ConfigurationTree getConfiguration() {
        return configuration;
    }

    @Override
    public List<Map<String, AssetValue>> build() {
        List<Map<String, AssetValue>> result = new ArrayList<>();
        List<Map<String, AssetValue>> rows = this.configuration.build();
        for( final Map<String, AssetValue> row : rows ) {
            AssetValue assetValue = new AssetValue() {

                @Override
                public DataPath getSourceDataPath() {
                    return configuration.getSource();
                }

                @Override
                public String getValue(AssetContext context) {
                    ChildAssetContext local = new ChildAssetContext(context, prefix);
                    local.setAll(row);
                    // TODO pull together all the name/value pairs and combine into a URL for us to handle internaly
                    return null;
                }

                @Override
                public String getName(AssetContext context) {
                    ChildAssetContext local = new ChildAssetContext(context, prefix);
                    local.setAll(row);
                    //return context.evaluate(IAssetLabConstants.KEY_OUTPUT_NAME);
                    // TODO extract the name (this may include directories, something to watch out for)
                    return null;
                }
            };

            Map<String, AssetValue> properties = new HashMap<>(1);
            properties.put(this.key, assetValue);
            result.add(properties);
        }

        return result;
    }
}
