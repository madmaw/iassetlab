package com.iassetlab.core;

import com.iassetlab.core.data.DataPath;
import com.iassetlab.core.frame.FrameGenerator;
import com.iassetlab.core.frame.FrameGeneratorFactory;
import com.iassetlab.core.frame.FrameHandler;

import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.util.Collection;
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

    public void generate(ConfigurationTree configuration, FrameHandler frameHandler) throws IOException {
        List<Map<String, AssetValue>> builds = configuration.build();
        AssetContext defaultAssetContext = new AssetContext(defaults);
        for( Map<String, AssetValue> build : builds ) {
            AssetContext assetContext = new AssetContext(defaultAssetContext, build);

            FrameGenerator frameGenerator = frameGeneratorFactory.create(assetContext);

            ByteArrayOutputStream bos = new ByteArrayOutputStream();
            frameGenerator.generate(assetContext, bos);

            ByteArrayInputStream bis = new ByteArrayInputStream(bos.toByteArray());
            frameHandler.addFrame(assetContext, bis);
        }
    }
}
