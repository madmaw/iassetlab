package com.iassetlab.core;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * Created with IntelliJ IDEA.
 * User: chris
 * Date: 25/02/13
 * Time: 12:43 PM
 * To change this template use File | Settings | File Templates.
 */
public class Diversifier implements AssetConfigurationSource {

    private String key;
    private List<ConfigurationTree> configurations;

    public Diversifier(String key, List<ConfigurationTree> configurations) {
        this.key = key;
        this.configurations = configurations;
    }

    @Override
    public List<Map<String, AssetValue>> build() {
        List<Map<String, AssetValue>> result = new ArrayList<>(configurations.size());
        for( ConfigurationTree configuration : configurations ) {
            List<Map<String, AssetValue>> rows = configuration.build();
            for( Map<String, AssetValue> row : rows ) {
                if( !row.containsKey(this.key) ) {
                    row.put(this.key, new Property(this.key, configuration.getName(), configuration.getName()));
                }
                result.add(row);
            }
        }
        return result;
    }
}
