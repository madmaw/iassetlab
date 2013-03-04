package com.iassetlab.core.parser.xml;

import com.iassetlab.core.*;
import com.iassetlab.core.data.ResourceDataPath;
import org.junit.Assert;
import org.junit.Test;

import javax.xml.parsers.DocumentBuilderFactory;
import java.util.List;
import java.util.Map;

/**
 * Created with IntelliJ IDEA.
 * User: chris
 * Date: 25/02/13
 * Time: 4:49 PM
 * To change this template use File | Settings | File Templates.
 */
public class TestXmlConfigurationTreeParser {
    @Test
    public void test1() throws Exception {

        ResourceDataPath path = new ResourceDataPath(this.getClass().getClassLoader(), "parsertest1.xml");

        XmlConfigurationTreeParser parser = new XmlConfigurationTreeParser(DocumentBuilderFactory.newInstance());
        ConfigurationTree tree = parser.parse(path);

        test1Tree("test1", tree);

    }

    private void test1Tree(String treeName, ConfigurationTree tree) {
        Assert.assertEquals(tree.getName(), treeName);

        AssetContext context = new BasicAssetContext();

        List<Property> properties = tree.getProperties();
        Assert.assertEquals(properties.size(), 4);
        Assert.assertEquals(properties.get(0).getKey(), "1");
        Assert.assertEquals(properties.get(0).getName(context), "a");
        Assert.assertEquals(properties.get(0).getValue(context), "A");
        Assert.assertEquals(properties.get(1).getKey(), "2");
        Assert.assertEquals(properties.get(1).getName(context), "b");
        Assert.assertEquals(properties.get(1).getValue(context), "B");
        Assert.assertEquals(properties.get(2).getKey(), "3");
        Assert.assertEquals(properties.get(2).getName(context), "c");
        Assert.assertEquals(properties.get(2).getValue(context), "C");
        Assert.assertEquals(properties.get(3).getKey(), "4");
        Assert.assertEquals(properties.get(3).getName(context), "d");
        Assert.assertEquals(properties.get(3).getValue(context), "D");

        Assert.assertEquals(tree.getDiversifiers().size(), 0);

        Assert.assertEquals(tree.getReferences().size(), 0);

        List<Map<String, AssetValue>> builds = tree.build();
        Assert.assertEquals(builds.size(), 1);

        Map<String, AssetValue> build = builds.get(0);
        Assert.assertEquals(build.size(), 4);
        Assert.assertEquals(build.get("1").getValue(context), "A");
        Assert.assertEquals(build.get("2").getValue(context), "B");
        Assert.assertEquals(build.get("3").getValue(context), "C");
        Assert.assertEquals(build.get("4").getValue(context), "D");
    }

    @Test
    public void test2() throws Exception {

        ResourceDataPath path = new ResourceDataPath(this.getClass().getClassLoader(), "parsertest2.xml");

        XmlConfigurationTreeParser parser = new XmlConfigurationTreeParser(DocumentBuilderFactory.newInstance());
        ConfigurationTree tree = parser.parse(path);
        test2Tree("test2", tree);

    }

    public void test2Tree(String treeName, ConfigurationTree tree) {
        Assert.assertEquals(tree.getName(), treeName);

        Assert.assertEquals(tree.getProperties().size(), 0);
        Assert.assertEquals(tree.getDiversifiers().size(), 0);

        List<Reference> references = tree.getReferences();
        Assert.assertEquals(references.size(), 1);

        Reference reference = references.get(0);

        ConfigurationTree referenceConfiguration = reference.getConfiguration();
        test1Tree("test1", referenceConfiguration);

        List<Map<String, AssetValue>> builds = tree.build();
        Assert.assertEquals(builds.size(), 1);

        AssetContext context = new BasicAssetContext();

        Map<String, AssetValue> build = builds.get(0);
        Assert.assertEquals(build.size(), 1);
        // TODO implement urls
        //Assert.assertEquals(build.get("ref").getValue(context), null);

    }

    @Test
    public void test3() throws Exception {
        ResourceDataPath path = new ResourceDataPath(this.getClass().getClassLoader(), "parsertest3.xml");

        XmlConfigurationTreeParser parser = new XmlConfigurationTreeParser(DocumentBuilderFactory.newInstance());
        ConfigurationTree tree = parser.parse(path);
        test2Tree("test3", tree);

        Assert.assertEquals("z", tree.getReferences().get(0).getPrefix());

        List<Map<String, AssetValue>> builds = tree.build();
        Assert.assertEquals(builds.size(), 1);

        AssetContext context = new BasicAssetContext();

        Map<String, AssetValue> build = builds.get(0);
        Assert.assertEquals(build.size(), 1);
        // TODO implement urls

    }

    @Test
    public void test4() throws Exception {
        ResourceDataPath path = new ResourceDataPath(this.getClass().getClassLoader(), "parsertest4.xml");

        XmlConfigurationTreeParser parser = new XmlConfigurationTreeParser(DocumentBuilderFactory.newInstance());
        ConfigurationTree tree = parser.parse(path);

        AssetContext context = new BasicAssetContext();

        List<Property> properties = tree.getProperties();
        Assert.assertEquals(properties.size(), 1);
        Assert.assertEquals(properties.get(0).getKey(), "x");
        Assert.assertEquals(properties.get(0).getName(context), "y");
        Assert.assertEquals(properties.get(0).getValue(context), "z");

        List<Diversifier> diversifiers = tree.getDiversifiers();
        Assert.assertEquals(diversifiers.size(), 1);
        Diversifier diversifier = diversifiers.get(0);
        Assert.assertEquals(diversifier.getKey(), "size");

        List<ConfigurationTree> configurations = diversifier.getConfigurations();
        Assert.assertEquals(configurations.size(), 2);
        ConfigurationTree configuration1 = configurations.get(0);
        Assert.assertEquals(configuration1.getName(), "small");

        List<Property> properties1 = configuration1.getProperties();
        Assert.assertEquals(properties1.size(), 2);
        Property property1width = properties1.get(0);
        Property property1height = properties1.get(1);
        Assert.assertEquals(property1width.getKey(), "width");
        Assert.assertEquals(property1width.getValue(context), "10");
        Assert.assertEquals(property1height.getKey(), "height");
        Assert.assertEquals(property1height.getValue(context), "20");

        ConfigurationTree configuration2 = configurations.get(1);
        Assert.assertEquals(configuration2.getName(), "large");

        List<Property> properties2 = configuration2.getProperties();
        Assert.assertEquals(properties2.size(), 2);
        Property property2width = properties2.get(0);
        Property property2height = properties2.get(1);
        Assert.assertEquals(property2width.getKey(), "width");
        Assert.assertEquals(property2width.getValue(context), "100");
        Assert.assertEquals(property2height.getKey(), "height");
        Assert.assertEquals(property2height.getValue(context), "200");

        List<Map<String, AssetValue>> builds = tree.build();
        Assert.assertEquals(builds.size(), 2);

        Map<String, AssetValue> smallBuild = builds.get(0);
        Assert.assertEquals("z", smallBuild.get("x").getValue(context));
        Assert.assertEquals("y", smallBuild.get("x").getName(context));
        Assert.assertEquals("small", smallBuild.get("size").getValue(context));
        Assert.assertEquals("10", smallBuild.get("width").getValue(context));
        Assert.assertEquals("20", smallBuild.get("height").getValue(context));

        Map<String, AssetValue> largeBuild = builds.get(1);
        Assert.assertEquals("z", largeBuild.get("x").getValue(context));
        Assert.assertEquals("y", largeBuild.get("x").getName(context));
        Assert.assertEquals("large", largeBuild.get("size").getValue(context));
        Assert.assertEquals("100", largeBuild.get("width").getValue(context));
        Assert.assertEquals("200", largeBuild.get("height").getValue(context));
    }
}
