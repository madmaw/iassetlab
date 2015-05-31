package com.iassetlab.core;

import com.iassetlab.core.frame.*;
import com.iassetlab.core.value.SimpleAssetValue;

import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.util.*;

/**
 * Created with IntelliJ IDEA.
 * User: chris
 * Date: 27/02/13
 * Time: 2:14 PM
 * To change this template use File | Settings | File Templates.
 */
public class AssetGenerator {

    private class ChildAssetContextWithDataPath extends ChildAssetContext {
        private DataPath dataPath;

        public ChildAssetContextWithDataPath(AssetContext parent, Map<String, AssetValue> values, DataPath dataPath) {
            super(parent, values);
            this.dataPath = dataPath;
        }

        public DataPath getDataPath() {
            return dataPath;
        }
    }

    private FrameGeneratorFactory frameGeneratorFactory;
    private Map<String, AssetValue> defaults;

    public AssetGenerator(FrameGeneratorFactory frameGeneratorFactory, Map<String, AssetValue> defaults) {
        this.frameGeneratorFactory = frameGeneratorFactory;
        this.defaults = defaults;
    }

    public void generate(ConfigurationTree configuration, FrameConsumer frameConsumer) throws IOException, FrameGenerationException, FrameGeneratorConfigurationException, FrameConsumptionException {
        generate(Arrays.asList(configuration), frameConsumer);
    }

    public void generate(List<ConfigurationTree> configurations, FrameConsumer frameConsumer) throws IOException, FrameGenerationException, FrameGeneratorConfigurationException, FrameConsumptionException {
        AssetContext defaultAssetContext = new BasicAssetContext(defaults);
        int sequenceNumber = 0;
        ArrayList<ChildAssetContextWithDataPath> contexts = new ArrayList<ChildAssetContextWithDataPath>();

        for( ConfigurationTree configuration : configurations ) {
            List<Map<String, AssetValue>> configurationBuilds = configuration.build();
            DataPath dataPath = configuration.getSource();
            for( Map<String, AssetValue> build : configurationBuilds ) {
                ChildAssetContextWithDataPath context = new ChildAssetContextWithDataPath(defaultAssetContext, build, dataPath);
                sequenceNumber++;
                String sequenceNumberString = Integer.toString(sequenceNumber);
                context.set(IAssetLabConstants.KEY_SEQUENCE_NUMBER, new SimpleAssetValue(dataPath, IAssetLabConstants.KEY_SEQUENCE_NUMBER, sequenceNumberString, sequenceNumberString));
                String maxSequenceNumberString = Integer.toString(configurations.size() - 1);
                context.set(IAssetLabConstants.KEY_MAX_SEQUENCE_NUMBER, new SimpleAssetValue(dataPath, IAssetLabConstants.KEY_MAX_SEQUENCE_NUMBER, maxSequenceNumberString, maxSequenceNumberString));
                contexts.add(context);
            }
        }

        Comparator<AssetContext> comparator = frameConsumer.getComparator();
        Collections.sort(contexts, comparator);

        for( ChildAssetContextWithDataPath context : contexts ) {

            boolean isFirst = frameConsumer.isFirst(context);
            // one more thing....
            context.set(
                    IAssetLabConstants.KEY_ASSET_FIRST_TO_FILE,
                    new SimpleAssetValue(null, IAssetLabConstants.KEY_ASSET_FIRST_TO_FILE, Boolean.toString(isFirst), Boolean.toString(isFirst))
            );
            FrameGenerator frameGenerator = frameGeneratorFactory.create(context);


            ByteArrayOutputStream bos = new ByteArrayOutputStream();
            AssetValue suppressValue = context.get(IAssetLabConstants.KEY_OUTPUT_SUPPRESS);

            if( suppressValue == null || !"true".equals(suppressValue.getValue(context)) ) {
                FrameMetadata metadata;
                try {
                    metadata = frameGenerator.generate(context.getDataPath(), context, bos);
                } catch( Exception ex ) {
                    throw new FrameGenerationException("error generating frame with context "+context.toString(), ex);
                }
                // the frame was skipped
                if( metadata != null ) {
                    ByteArrayInputStream bis = new ByteArrayInputStream(bos.toByteArray());
                    String mimeType = metadata.getMimeType();
                    frameConsumer.consume(context, bis, mimeType);
                }
            }
        }

        frameConsumer.close();
    }
}