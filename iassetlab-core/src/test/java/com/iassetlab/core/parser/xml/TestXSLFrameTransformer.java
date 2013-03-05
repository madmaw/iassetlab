package com.iassetlab.core.parser.xml;

import com.iassetlab.core.AssetContext;
import com.iassetlab.core.AssetValue;
import com.iassetlab.core.BasicAssetContext;
import com.iassetlab.core.ConfigurationTree;
import com.iassetlab.core.data.DataPath;
import com.iassetlab.core.data.ResourceDataPath;
import com.iassetlab.core.data.ResourceDataPathFactory;
import com.iassetlab.core.frame.FrameMetadata;
import com.iassetlab.core.frame.transformer.FrameTransformer;
import com.iassetlab.core.frame.transformer.xsl.XSLFrameTransformer;
import com.iassetlab.core.frame.transformer.xsl.XSLFrameTransformerFactory;
import org.apache.commons.io.IOUtils;
import org.apache.velocity.app.VelocityEngine;
import org.junit.Assert;
import org.junit.Test;

import javax.xml.parsers.DocumentBuilderFactory;
import javax.xml.transform.TransformerFactory;
import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.util.*;

/**
 * Created with IntelliJ IDEA.
 * User: chris
 * Date: 1/03/13
 * Time: 9:11 AM
 * To change this template use File | Settings | File Templates.
 */
public class TestXSLFrameTransformer {

    public void testSingleOutput(String pathToXML, String expectedOutput) throws Exception {
        ArrayList result = new ArrayList(1);
        result.add(expectedOutput);
        testMultipleOutput(pathToXML, result);
    }

    public void testMultipleOutput(String pathToXML, Collection<String> strings) throws Exception {
        ResourceDataPathFactory pathFactory = new ResourceDataPathFactory(this.getClass().getClassLoader());
        DataPath path = pathFactory.getDataPath(pathToXML);

        VelocityEngine velocityEngine = new VelocityEngine();
        XmlConfigurationTreeParser parser = new XmlConfigurationTreeParser(DocumentBuilderFactory.newInstance(), VelocityAssetValueFactory.getInstance());
        ConfigurationTree tree = parser.parse(path);
        List<Map<String, AssetValue>> builds = tree.build();
        Assert.assertEquals(builds.size(), strings.size());


        for( Map<String, AssetValue> build : builds ) {
            AssetContext context = new BasicAssetContext(build);

            XSLFrameTransformerFactory frameTransformerFactory = new XSLFrameTransformerFactory(TransformerFactory.newInstance(), pathFactory, null);

            FrameTransformer frameTransformer = frameTransformerFactory.create(context);
            ByteArrayOutputStream bos = new ByteArrayOutputStream();
            InputStream ins = XSLFrameTransformerFactory.class.getClassLoader().getResourceAsStream("default.xml");
            FrameMetadata inputMetadata = new FrameMetadata("text/xml", path);
            try {
                FrameMetadata outputMetadata = frameTransformer.transform(ins, inputMetadata, bos);
                Assert.assertEquals(outputMetadata.getMimeType(), "image/svg+xml");
            } finally {
                IOUtils.closeQuietly(ins);
            }
            byte[] data = bos.toByteArray();
            String s = new String(data);
            Assert.assertTrue(s, strings.remove(s));
        }
    }

    @Test
    public void test1() throws Exception {
        testSingleOutput("transformertest1.xml", "<?xml version=\"1.0\" encoding=\"UTF-8\"?><svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"-32 -32 64 64\" height=\"64\" width=\"64\"><g><rect height=\"32\" width=\"32\" y=\"16\" x=\"16\" stroke=\"black\" stroke-width=\"3\" fill=\"#FF0000\"/></g></svg>");
    }


    @Test
    public void test2() throws Exception {
        testSingleOutput("transformertest2.xml", "<?xml version=\"1.0\" encoding=\"UTF-8\"?><svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"-10 -20 20 40\" height=\"40\" width=\"20\"><g><rect height=\"20\" width=\"10\" y=\"10\" x=\"5\" stroke=\"black\" stroke-width=\"3\" fill=\"green\"/></g></svg>");
    }

    @Test
    public void test3() throws Exception {
        HashSet<String> strings = new HashSet<>(4);
        strings.add("<?xml version=\"1.0\" encoding=\"UTF-8\"?><svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"-5 -10 10 20\" height=\"20\" width=\"10\"><g><rect height=\"10\" width=\"5\" y=\"5\" x=\"2.5\" stroke=\"black\" stroke-width=\"3\" fill=\"red\"/></g></svg>");
        strings.add("<?xml version=\"1.0\" encoding=\"UTF-8\"?><svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"-5 -10 10 20\" height=\"20\" width=\"10\"><g><rect height=\"10\" width=\"5\" y=\"5\" x=\"2.5\" stroke=\"black\" stroke-width=\"3\" fill=\"green\"/></g></svg>");
        strings.add("<?xml version=\"1.0\" encoding=\"UTF-8\"?><svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"-50 -100 100 200\" height=\"200\" width=\"100\"><g><rect height=\"100\" width=\"50\" y=\"50\" x=\"25\" stroke=\"black\" stroke-width=\"3\" fill=\"red\"/></g></svg>");
        strings.add("<?xml version=\"1.0\" encoding=\"UTF-8\"?><svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"-50 -100 100 200\" height=\"200\" width=\"100\"><g><rect height=\"100\" width=\"50\" y=\"50\" x=\"25\" stroke=\"black\" stroke-width=\"3\" fill=\"green\"/></g></svg>");
        testMultipleOutput("transformertest3.xml", strings);
    }

}
