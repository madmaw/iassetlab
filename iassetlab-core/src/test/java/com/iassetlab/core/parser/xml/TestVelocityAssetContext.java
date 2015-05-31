package com.iassetlab.core.parser.xml;

import com.iassetlab.core.AssetValue;
import com.iassetlab.core.BasicAssetContext;
import com.iassetlab.core.ConfigurationTree;
import com.iassetlab.core.data.ResourceDataPath;
import org.junit.Assert;
import org.junit.Test;

import javax.xml.parsers.DocumentBuilderFactory;
import java.util.HashSet;
import java.util.List;
import java.util.Map;

/**
 * Created with IntelliJ IDEA.
 * User: chris
 * Date: 5/03/13
 * Time: 2:37 PM
 * To change this template use File | Settings | File Templates.
 */
public class TestVelocityAssetContext {

    @Test
    public void test1() throws Exception {
        ResourceDataPath path = new ResourceDataPath(this.getClass().getClassLoader(), "velocityassettest1.xml");

        XmlConfigurationTreeParser parser = new XmlConfigurationTreeParser(DocumentBuilderFactory.newInstance(), VelocityAssetValueFactory.getInstance());
        ConfigurationTree tree = parser.parse(path);

        List<Map<String, AssetValue>> builds = tree.build();
        Assert.assertEquals(1, builds.size());
        for( Map<String, AssetValue> build : builds ) {
            BasicAssetContext assetContext = new BasicAssetContext(build);

            AssetValue literal = assetContext.get("literal");
            Assert.assertEquals("literal-value", literal.getValue(assetContext));
            Assert.assertEquals("literal-name", literal.getName(assetContext));

            AssetValue dynamic = assetContext.get("dynamic");
            Assert.assertEquals("dynamic-value", dynamic.getValue(assetContext));
            Assert.assertEquals("dynamic-name", dynamic.getName(assetContext));
        }
    }

    @Test
    public void test2() throws Exception {
        ResourceDataPath path = new ResourceDataPath(this.getClass().getClassLoader(), "velocityassettest2.xml");

        XmlConfigurationTreeParser parser = new XmlConfigurationTreeParser(DocumentBuilderFactory.newInstance(), VelocityAssetValueFactory.getInstance());
        ConfigurationTree tree = parser.parse(path);

        List<Map<String, AssetValue>> builds = tree.build();
        Assert.assertEquals(1, builds.size());
        for( Map<String, AssetValue> build : builds ) {
            BasicAssetContext assetContext = new BasicAssetContext(build);

            AssetValue v1 = assetContext.get("v1");
            Assert.assertEquals("A", v1.getValue(assetContext));

            AssetValue v2 = assetContext.get("v2");
            Assert.assertEquals("B", v2.getValue(assetContext));

            AssetValue v3 = assetContext.get("v3");
            Assert.assertEquals("C", v3.getValue(assetContext));

            AssetValue d1 = assetContext.get("d1");
            Assert.assertEquals("A", d1.getValue(assetContext));

            AssetValue d2 = assetContext.get("d2");
            Assert.assertEquals("A - B", d2.getValue(assetContext));

            AssetValue d3 = assetContext.get("d3");
            Assert.assertEquals("A - B - C", d3.getValue(assetContext));

            AssetValue d4 = assetContext.get("d4");
            Assert.assertEquals("ABC", d4.getValue(assetContext));
        }
    }


    @Test
    public void test3() throws Exception {
        ResourceDataPath path = new ResourceDataPath(this.getClass().getClassLoader(), "velocityassettest3.xml");

        XmlConfigurationTreeParser parser = new XmlConfigurationTreeParser(DocumentBuilderFactory.newInstance(), VelocityAssetValueFactory.getInstance());
        ConfigurationTree tree = parser.parse(path);

        List<Map<String, AssetValue>> builds = tree.build();

        HashSet<String> greetings = new HashSet<String>();
        greetings.add("Hello William");
        greetings.add("Hello Simion");

        Assert.assertEquals(greetings.size(), builds.size());
        for( Map<String, AssetValue> build : builds ) {
            BasicAssetContext assetContext = new BasicAssetContext(build);
            AssetValue greeting = assetContext.get("greeting");
            String greetingValue = greeting.getValue(assetContext);
            Assert.assertTrue("missing "+greetingValue, greetings.remove(greetingValue));
        }
    }
}
