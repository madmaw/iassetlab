package com.iassetlab.core;

import com.iassetlab.core.data.DataPath;
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
    private FrameGeneratorFactory frameGeneratorFactory;
    private Map<String, AssetValue> defaults;

    public AssetGenerator(FrameGeneratorFactory frameGeneratorFactory, Map<String, AssetValue> defaults) {
        this.frameGeneratorFactory = frameGeneratorFactory;
        this.defaults = defaults;
    }

    public void generate(DataPath systemPath, ConfigurationTree configuration, FrameConsumer frameConsumer) throws IOException, FrameGenerationException, FrameGeneratorConfigurationException, FrameConsumptionException {
        List<Map<String, AssetValue>> builds = configuration.build();
        AssetContext defaultAssetContext = new BasicAssetContext(defaults);
        int sequenceNumber = 0;
        ArrayList<ChildAssetContext> contexts = new ArrayList<ChildAssetContext>(builds.size());

        for( Map<String, AssetValue> build : builds ) {
            ChildAssetContext context = new ChildAssetContext(defaultAssetContext, build);
            sequenceNumber++;
            String sequenceNumberString = Integer.toString(sequenceNumber);
            context.set(IAssetLabConstants.KEY_ASSET_ID, new SimpleAssetValue(IAssetLabConstants.KEY_ASSET_ID, sequenceNumberString, sequenceNumberString));
            contexts.add(context);
        }

        Comparator<AssetContext> comparator = frameConsumer.getComparator();
        Collections.sort(contexts, comparator);

        for( ChildAssetContext context : contexts ) {

            FrameGenerator frameGenerator = frameGeneratorFactory.create(context);

            ByteArrayOutputStream bos = new ByteArrayOutputStream();
            FrameMetadata metadata = frameGenerator.generate(systemPath, context, bos);

            ByteArrayInputStream bis = new ByteArrayInputStream(bos.toByteArray());
            String mimeType = metadata.getMimeType();
            frameConsumer.consume(context, bis, mimeType);
        }

        frameConsumer.close();
    }
}
