package com.iassetlab.core;

import com.iassetlab.core.data.DataPath;
import com.iassetlab.core.frame.*;

import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.util.List;
import java.util.Map;

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

    public void generate(DataPath systemPath, ConfigurationTree configuration, FrameConsumer frameConsumer) throws IOException, FrameGenerationException, FrameGeneratorConfigurationException {
        List<Map<String, AssetValue>> builds = configuration.build();
        AssetContext defaultAssetContext = new AssetContext(defaults);
        for( Map<String, AssetValue> build : builds ) {
            AssetContext assetContext = new AssetContext(defaultAssetContext, build);

            FrameGenerator frameGenerator = frameGeneratorFactory.create(assetContext);

            ByteArrayOutputStream bos = new ByteArrayOutputStream();
            FrameMetadata metadata = frameGenerator.generate(systemPath, assetContext, bos);

            ByteArrayInputStream bis = new ByteArrayInputStream(bos.toByteArray());
            frameConsumer.consume(assetContext, bis, metadata.getMimeType());
        }
    }
}
