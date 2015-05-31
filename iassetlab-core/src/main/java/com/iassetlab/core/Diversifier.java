package com.iassetlab.core;

import com.iassetlab.core.value.SimpleAssetValue;

import java.util.ArrayList;
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

    public String getKey() {
        return key;
    }

    public List<ConfigurationTree> getConfigurations() {
        return configurations;
    }

    @Override
    public List<Map<String, AssetValue>> build() {
        List<Map<String, AssetValue>> result = new ArrayList<Map<String, AssetValue>>(configurations.size());

        for( int i =0; i<configurations.size(); i++ ) {
            ConfigurationTree configuration = this.configurations.get(i);
            List<Map<String, AssetValue>> rows = configuration.build();
            for( Map<String, AssetValue> row : rows ) {
                if( !row.containsKey(this.key) ) {
                    SimpleAssetValue name = new SimpleAssetValue(configuration.getSource(), this.key, configuration.getName(), configuration.getName());
                    row.put(this.key, name);
                }
                String sequenceNumberKey = IAssetLabConstants.KEY_SEQUENCE_NUMBER_PREFIX + this.key;
                String maxSequenceNumberKey = IAssetLabConstants.KEY_MAX_SEQUENCE_NUMBER_PREFIX + this.key;
                if( !row.containsKey(sequenceNumberKey) ) {
                    row.put(sequenceNumberKey, new SimpleAssetValue(configuration.getSource(), sequenceNumberKey, sequenceNumberKey, Integer.toString(i)));
                }
                if( !row.containsKey(maxSequenceNumberKey) ) {
                    row.put(maxSequenceNumberKey, new SimpleAssetValue(configuration.getSource(), maxSequenceNumberKey, maxSequenceNumberKey, Integer.toString(configurations.size() - 1)));
                }

                result.add(row);
            }
        }
        return result;
    }
}
