package com.iassetlab.core.parser.xml;

import com.iassetlab.core.AssetValue;
import com.iassetlab.core.ConfigurationTree;
import com.iassetlab.core.Diversifier;
import com.iassetlab.core.value.SimpleAssetValue;
import com.iassetlab.core.Reference;
import com.iassetlab.core.parser.ConfigurationParseException;
import com.iassetlab.core.parser.ConfigurationTreeParser;
import com.iassetlab.core.data.DataPath;
import org.apache.commons.io.IOUtils;
import org.apache.commons.io.input.BOMInputStream;
import org.w3c.dom.Document;
import org.w3c.dom.Element;
import org.w3c.dom.Node;
import org.xml.sax.SAXException;

import javax.xml.parsers.DocumentBuilder;
import javax.xml.parsers.DocumentBuilderFactory;
import javax.xml.parsers.ParserConfigurationException;
import java.io.IOException;
import java.io.InputStream;
import java.util.ArrayList;
import java.util.List;

/**
 * Created with IntelliJ IDEA.
 * User: chris
 * Date: 25/02/13
 * Time: 3:30 PM
 * To change this template use File | Settings | File Templates.
 */
public class XmlConfigurationTreeParser implements ConfigurationTreeParser {



    private static final String CONFIGURATION_TREE_ELEMENT_NAME   = "configuration";
    private static final String CONFIGURATION_TREE_NAME_ATTRIBUTE = "name";

    private static final String PROPERTY_ELEMENT_NAME               = "property";
    private static final String PROPERTY_KEY_ATTRIBUTE              = "key";
    private static final String PROPERTY_NAME_ATTRIBUTE             = "name";

    private static final String REFERENCE_ELEMENT_NAME              = "reference";
    private static final String REFERENCE_KEY_ATTRIBUTE             = "key";
    private static final String REFERENCE_PATH_ATTRIBUTE            = "path";
    private static final String REFERENCE_PREFIX_ATTRIBUTE          = "prefix";

    private static final String DIVERSIFIER_ELEMENT_NAME            = "diversifier";
    private static final String DIVERSIFIER_KEY_ATTRIBUTE           = "key";


    private DocumentBuilderFactory documentBuilderFactory;
    private AssetValueFactory assetValueFactory;

    public XmlConfigurationTreeParser(DocumentBuilderFactory documentBuilderFactory, AssetValueFactory assetValueFactory) {
        this.documentBuilderFactory = documentBuilderFactory;
        this.assetValueFactory = assetValueFactory;
    }

    @Override
    public ConfigurationTree parse(DataPath path) throws IOException, ConfigurationParseException {
        DocumentBuilder documentBuilder;
        try {
            documentBuilder = this.documentBuilderFactory.newDocumentBuilder();
        } catch( ParserConfigurationException ex ) {
            throw new ConfigurationParseException(ex);
        }
        Document document;
        InputStream ins = path.open();
        if( ins != null ) {
            /*
            List<String> lines = IOUtils.readLines(ins);
            for( String line : lines ) {
                System.out.println(line);
            }
            ins = path.open();
            */

            ins = new BOMInputStream(ins);


        } else {
            throw new ConfigurationParseException("invalid path "+path);
        }
        try {
            document = documentBuilder.parse(ins);
        } catch( SAXException ex ) {
            throw new ConfigurationParseException(ex);
        } finally {
            IOUtils.closeQuietly(ins);
        }

        // turn it into a configuration tree
        return parseConfigurationTree(path, document.getDocumentElement());
    }

    public ConfigurationTree parseConfigurationTree(DataPath path, Element configurationTreeElement) throws ConfigurationParseException, IOException {
        String name = configurationTreeElement.getAttribute(CONFIGURATION_TREE_NAME_ATTRIBUTE);

        List<Element> propertyNodes = getElementsByTagName(configurationTreeElement, PROPERTY_ELEMENT_NAME);
        ArrayList<ConfigurationTree.Property> properties = new ArrayList<>(propertyNodes.size());
        for( int i=0; i<propertyNodes.size(); i++ ) {
            Element propertyElement = propertyNodes.get(i);
            ConfigurationTree.Property property = parseProperty(propertyElement);
            properties.add(property);
        }

        List<Element> referenceNodes = getElementsByTagName(configurationTreeElement, REFERENCE_ELEMENT_NAME);
        ArrayList<Reference> references = new ArrayList<>(referenceNodes.size());
        for( int i=0; i<referenceNodes.size(); i++ ) {
            Element referenceElement = (Element)referenceNodes.get(i);
            Reference reference = parseReference(path, referenceElement);
            references.add(reference);
        }

        List<Element> diversifierNodes = getElementsByTagName(configurationTreeElement, DIVERSIFIER_ELEMENT_NAME);
        ArrayList<Diversifier> diversifiers = new ArrayList<>(diversifierNodes.size());
        for( int i=0; i<diversifierNodes.size(); i++ ) {
            Element diversifierElement = (Element)diversifierNodes.get(i);
            Diversifier diversifier = parseDiversifier(path, diversifierElement);
            diversifiers.add(diversifier);
        }

        return new ConfigurationTree(name, properties, references, diversifiers);
    }

    public ConfigurationTree.Property parseProperty(Element propertyElement) throws ConfigurationParseException, IOException {
        String key = propertyElement.getAttribute(PROPERTY_KEY_ATTRIBUTE);
        String name = propertyElement.getAttribute(PROPERTY_NAME_ATTRIBUTE);
        String value = propertyElement.getTextContent();
        try {
            AssetValue assetValue = assetValueFactory.create(name, value);
            return new ConfigurationTree.Property(key, assetValue);
        } catch( InvalidAssetValueTemplateException ex ) {
            throw new ConfigurationParseException(ex);
        }
    }

    public Diversifier parseDiversifier(DataPath path, Element diversifierElement) throws ConfigurationParseException, IOException {
        String key = diversifierElement.getAttribute(DIVERSIFIER_KEY_ATTRIBUTE);
        List<Element> configurationTreeNodes = getElementsByTagName(diversifierElement, CONFIGURATION_TREE_ELEMENT_NAME);
        ArrayList<ConfigurationTree> configurationTrees = new ArrayList<>(configurationTreeNodes.size());
        for( int i=0; i<configurationTreeNodes.size(); i++ ) {
            Element configurationTreeElement = (Element)configurationTreeNodes.get(i);
            ConfigurationTree configurationTree = parseConfigurationTree(path, configurationTreeElement);
            configurationTrees.add(configurationTree);
        }
        return new Diversifier(key, configurationTrees);
    }

    public Reference parseReference(DataPath path, Element referenceElement) throws ConfigurationParseException, IOException {
        String key = referenceElement.getAttribute(REFERENCE_KEY_ATTRIBUTE);
        String prefix = referenceElement.getAttribute(REFERENCE_PREFIX_ATTRIBUTE);
        String reference = referenceElement.getAttribute(REFERENCE_PATH_ATTRIBUTE);
        ConfigurationTree configurationTree;
        if( reference == null || reference.trim().length() == 0) {
            // does it contain a configuration node?
            List<Element> configurationTreeNodes = getElementsByTagName(referenceElement, CONFIGURATION_TREE_ELEMENT_NAME);
            if( configurationTreeNodes.size() == 1 ) {
                Element configurationTreeElement = (Element)configurationTreeNodes.get(0);
                configurationTree = parseConfigurationTree(path, configurationTreeElement);
            } else {
                throw new ConfigurationParseException("found "+configurationTreeNodes.size()+" reference elements, expected 1");
            }
        } else {
            DataPath referencePath = path.getRelativePath(reference);
            configurationTree = parse(referencePath);
        }
        return new Reference(key, prefix, configurationTree);
    }

    private static List<Element> getElementsByTagName(Element parent, String tagName) {

        ArrayList<Element> result = new ArrayList<>();
        Node child = parent.getFirstChild();
        while( child != null ) {
            if( child instanceof Element ) {
                Element element = (Element)child;
                if( tagName.equals(element.getTagName()) ) {
                    result.add(element);
                }
            }
            child = child.getNextSibling();
        }
        return result;
    }
}
