package com.iassetlab.core;

import com.iassetlab.core.value.SimpleAssetValue;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * Created with IntelliJ IDEA.
 * User: chris
 * Date: 25/02/13
 * Time: 12:39 PM
 * To change this template use File | Settings | File Templates.
 */
public class ConfigurationTree implements AssetConfigurationSource {

    public static class Property {
        private String key;
        private String type;
        private AssetValue assetValue;

        public Property(String key, String type, AssetValue assetValue) {
            this.key = key;
            this.type = type;
            this.assetValue = assetValue;
        }

        public String getKey() {
            return key;
        }

        public String getType() {
            return type;
        }

        public AssetValue getAssetValue() {
            return assetValue;
        }

        public String getName(AssetContext context) {
            return this.assetValue.getName(context);
        }

        public String getValue(AssetContext context) {
            return this.assetValue.getValue(context);
        }
    }

    private DataPath source;
    private String name;
    private List<Property> properties;
    private List<Reference> references;
    private List<Diversifier> diversifiers;

    public ConfigurationTree(DataPath source, String name, List<Property> properties, List<Reference> references, List<Diversifier> diversifiers) {
        this.source = source;
        this.name = name;
        this.properties = properties;
        this.references = references;
        this.diversifiers = diversifiers;
    }

    public DataPath getSource() {
        return source;
    }

    public List<Property> getProperties() {
        return properties;
    }

    public List<Reference> getReferences() {
        return references;
    }

    public List<Diversifier> getDiversifiers() {
        return diversifiers;
    }

    public String getName() {
        return name;
    }

    @Override
    public List<Map<String, AssetValue>> build() {
        Map<String, AssetValue> local = new HashMap<>(properties.size());

        for( Property property : properties ) {
            local.put(property.getKey(), property.getAssetValue());
        }

        List<AssetConfigurationSource> configurationSources = new ArrayList<>( this.references.size() + this.diversifiers.size() );
        List<List<Map<String, AssetValue>>> assetConfigurations = new ArrayList<>( this.references.size() + this.diversifiers.size() );
        configurationSources.addAll(references);
        configurationSources.addAll(diversifiers);

        int numAssetConfigurations = 1;
        for( AssetConfigurationSource assetConfigurationSource : configurationSources ) {
            List<Map<String, AssetValue>> assetConfiguration = assetConfigurationSource.build();
            numAssetConfigurations *= assetConfiguration.size();
            assetConfigurations.add(assetConfiguration);
        }
        List<Map<String, AssetValue>> result = new ArrayList<>(numAssetConfigurations);
        for( int i=0; i<numAssetConfigurations; i++ ) {
            Map<String, AssetValue> row = new HashMap<>(local);

            int index = i;
            // reverse the loop so we reduce the back-most configuration first
            for( int j=assetConfigurations.size(); j>0; ) {
                j--;
                List<Map<String, AssetValue>> assetConfiguration = assetConfigurations.get(j);
                Map<String, AssetValue> assetValues = assetConfiguration.get(index % assetConfiguration.size());
                row.putAll(assetValues);
                index /= assetConfiguration.size();
            }
            result.add(row);
        }
        return result;
    }
}
