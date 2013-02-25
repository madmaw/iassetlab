package com.iassetlab.core.parser.xml;

import com.iassetlab.core.AssetContext;
import com.iassetlab.core.ConfigurationTree;
import com.iassetlab.core.Property;
import com.iassetlab.core.parser.ResourceDataPath;
import org.junit.Assert;
import org.junit.Test;

import javax.xml.parsers.DocumentBuilderFactory;
import java.util.List;

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

        ResourceDataPath path = new ResourceDataPath(this.getClass().getClassLoader(), "/test1.xml");

        XmlConfigurationTreeParser parser = new XmlConfigurationTreeParser(DocumentBuilderFactory.newInstance());
        ConfigurationTree tree = parser.parse(path);

        Assert.assertEquals(tree.getName(), "test1");

        AssetContext context = new AssetContext();

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
    }
}
