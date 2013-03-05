package com.iassetlab.core.parser.xml;

import com.iassetlab.core.*;
import com.iassetlab.core.DataPath;
import com.iassetlab.core.data.ResourceDataPathFactory;
import com.iassetlab.core.frame.FrameGeneratorFactory;
import com.iassetlab.core.frame.FrameMetadataFactory;
import com.iassetlab.core.frame.consumer.InMemoryFrameConsumer;
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
 * Date: 1/03/13
 * Time: 4:41 PM
 * To change this template use File | Settings | File Templates.
 */
public class TestAssetGenerator extends AbstractHumanVerificationTest {

    @Test
    public void test1() throws Exception {

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
                "svg+xml"
        );
        AssetGenerator assetGenerator = new AssetGenerator(
                frameGeneratorFactory,
                new HashMap<String, AssetValue>()
        );

        InMemoryFrameConsumer frameConsumer = new InMemoryFrameConsumer();

        ResourceDataPathFactory pathFactory = new ResourceDataPathFactory(this.getClass().getClassLoader());
        DataPath path = pathFactory.getDataPath("generatortest1.xml");

        XmlConfigurationTreeParser parser = new XmlConfigurationTreeParser(DocumentBuilderFactory.newInstance(), VelocityAssetValueFactory.getInstance());
        ConfigurationTree configuration = parser.parse(path);

        assetGenerator.generate(
                configuration,
                frameConsumer
        );

        List<byte[]> frames = frameConsumer.getFrames();
        Assert.assertEquals(frames.size(), 1);
        // check frame content
        for( byte[] frame : frames ) {
            String s = new String(frame);
            Assert.assertEquals(s.trim(), "<?xml version=\"1.0\" encoding=\"UTF-8\"?><svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"-32 -32 64 64\" height=\"64\" width=\"64\"><g><rect height=\"32\" width=\"32\" y=\"16\" x=\"16\" stroke=\"black\" stroke-width=\"3\" fill=\"#FF0000\"/></g></svg>");
        }
    }

    @Test
    public void test2() throws Exception {
        // test override default output type
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

        InMemoryFrameConsumer frameConsumer = new InMemoryFrameConsumer();

        ResourceDataPathFactory pathFactory = new ResourceDataPathFactory(this.getClass().getClassLoader());
        DataPath path = pathFactory.getDataPath("generatortest2.xml");

        XmlConfigurationTreeParser parser = new XmlConfigurationTreeParser(DocumentBuilderFactory.newInstance(), VelocityAssetValueFactory.getInstance());
        ConfigurationTree configuration = parser.parse(path);

        assetGenerator.generate(
                configuration,
                frameConsumer
        );

        List<byte[]> frames = frameConsumer.getFrames();
        Assert.assertEquals(frames.size(), 1);
        // check frame content
        for( byte[] frame : frames ) {
            String s = new String(frame);
            Assert.assertEquals(s.trim(), "<?xml version=\"1.0\" encoding=\"UTF-8\"?><svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"-32 -32 64 64\" height=\"64\" width=\"64\"><g><rect height=\"32\" width=\"32\" y=\"16\" x=\"16\" stroke=\"black\" stroke-width=\"3\" fill=\"#00ff00\"/></g></svg>");
        }
    }

    @Test
    public void test3() throws Exception {
        manualTest("generatortest3.xml", 1);
    }

    @Test
    public void test4() throws Exception {
        manualTest("generatortest4.xml", 3);
    }

    private void manualTest( String xmlPath, int quantity ) throws Exception {
        // test PNG output
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

        InMemoryFrameConsumer frameConsumer = new InMemoryFrameConsumer();

        ResourceDataPathFactory pathFactory = new ResourceDataPathFactory(this.getClass().getClassLoader());
        DataPath path = pathFactory.getDataPath(xmlPath);

        XmlConfigurationTreeParser parser = new XmlConfigurationTreeParser(DocumentBuilderFactory.newInstance(), VelocityAssetValueFactory.getInstance());
        ConfigurationTree configuration = parser.parse(path);

        assetGenerator.generate(
                configuration,
                frameConsumer
        );

        List<byte[]> frames = frameConsumer.getFrames();
        Assert.assertEquals(frames.size(), quantity);
        // check frame content
        for( byte[] frame : frames ) {
            doHumanVerification(frame);
        }
    }
}
