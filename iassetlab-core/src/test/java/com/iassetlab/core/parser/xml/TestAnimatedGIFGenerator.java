package com.iassetlab.core.parser.xml;

import com.iassetlab.core.AssetGenerator;
import com.iassetlab.core.AssetValue;
import com.iassetlab.core.ConfigurationTree;
import com.iassetlab.core.IAssetLabConstants;
import com.iassetlab.core.data.DataPath;
import com.iassetlab.core.data.ResourceDataPathFactory;
import com.iassetlab.core.frame.FrameGeneratorFactory;
import com.iassetlab.core.frame.FrameMetadataFactory;
import com.iassetlab.core.frame.consumer.DelegatingFrameConsumer;
import com.iassetlab.core.frame.consumer.InMemoryFrameConsumer;
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
public class TestAnimatedGIFGenerator extends AbstractHumanVerificationTest {
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

        ResourceDataPathFactory xslDataPathFactory = new ResourceDataPathFactory(
                IAssetLabConstants.class.getClassLoader()
        );

        FrameGeneratorFactory frameGeneratorFactory = new XSLSVGImagePipelineFrameGeneratorFactory(
                frameMetadataFactory,
                transformerFactory,
                xslDataPathFactory,
                "image/svg+xml",
                "image",
                "png"
        );
        AssetGenerator assetGenerator = new AssetGenerator(
                frameGeneratorFactory,
                new HashMap<String, AssetValue>()
        );

        ResourceDataPathFactory pathFactory = new ResourceDataPathFactory(this.getClass().getClassLoader());
        DataPath path = pathFactory.getDataPath("gifgeneratortest1.xml");

        XmlConfigurationTreeParser parser = new XmlConfigurationTreeParser(DocumentBuilderFactory.newInstance());
        ConfigurationTree configuration = parser.parse(path);

        assetGenerator.generate(
                path,
                configuration,
                frameConsumer
        );

        List<byte[]> frames = frameConsumerFactory.getFrames();
        //Assert.assertEquals(frames.size(), 1);
        // check frame content
        for( byte[] frame : frames ) {
            doHumanVerification(frame);
        }

    }
}
