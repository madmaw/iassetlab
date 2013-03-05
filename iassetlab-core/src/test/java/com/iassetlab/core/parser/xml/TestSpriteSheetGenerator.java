package com.iassetlab.core.parser.xml;

import com.iassetlab.core.AssetGenerator;
import com.iassetlab.core.AssetValue;
import com.iassetlab.core.ConfigurationTree;
import com.iassetlab.core.IAssetLabConstants;
import com.iassetlab.core.DataPath;
import com.iassetlab.core.data.ResourceDataPathFactory;
import com.iassetlab.core.frame.FrameGeneratorFactory;
import com.iassetlab.core.frame.FrameMetadataFactory;
import com.iassetlab.core.frame.consumer.DelegatingFrameConsumer;
import com.iassetlab.core.frame.consumer.factory.InMemoryFrameConsumerFactory;
import com.iassetlab.core.frame.consumer.factory.SmartImageFrameConsumerFactory;
import com.iassetlab.core.frame.metadata.DataPathFrameMetadataFactory;
import com.iassetlab.core.frame.transformer.XSLSVGImagePipelineFrameGeneratorFactory;
import org.junit.Assert;
import org.junit.Test;

import javax.xml.parsers.DocumentBuilderFactory;
import javax.xml.transform.TransformerFactory;
import java.util.HashMap;
import java.util.List;

/**
 * Created with IntelliJ IDEA.
 * User: chris
 * Date: 4/03/13
 * Time: 8:56 PM
 * To change this template use File | Settings | File Templates.
 */
public class TestSpriteSheetGenerator extends AbstractHumanVerificationTest {
    @Test
    public void test1() throws Exception {
        InMemoryFrameConsumerFactory frameConsumerFactory = new InMemoryFrameConsumerFactory();
        SmartImageFrameConsumerFactory imageFrameConsumerFactory = new SmartImageFrameConsumerFactory(frameConsumerFactory);
        DelegatingFrameConsumer frameConsumer = new DelegatingFrameConsumer(imageFrameConsumerFactory);

        FrameMetadataFactory frameMetadataFactory = new DataPathFrameMetadataFactory(
                IAssetLabConstants.KEY_XML_PATH,
                "text/xml",
                "default.xml"
        );
        TransformerFactory transformerFactory = TransformerFactory.newInstance();

        FrameGeneratorFactory frameGeneratorFactory = new XSLSVGImagePipelineFrameGeneratorFactory(
                frameMetadataFactory,
                transformerFactory,
                "image/svg+xml",
                "image",
                "png"
        );
        AssetGenerator assetGenerator = new AssetGenerator(
                frameGeneratorFactory,
                new HashMap<String, AssetValue>()
        );

        ResourceDataPathFactory pathFactory = new ResourceDataPathFactory(this.getClass().getClassLoader());
        DataPath path = pathFactory.getDataPath("spritesheetgeneratortest1.xml");

        XmlConfigurationTreeParser parser = new XmlConfigurationTreeParser(DocumentBuilderFactory.newInstance(), VelocityAssetValueFactory.getInstance());
        ConfigurationTree configuration = parser.parse(path);

        assetGenerator.generate(
                configuration,
                frameConsumer
        );

        List<byte[]> frames = frameConsumerFactory.getFrames();
        Assert.assertEquals(frames.size(), 1);
        // check frame content
        for( byte[] frame : frames ) {
            doHumanVerification(frame);
        }

    }
}
