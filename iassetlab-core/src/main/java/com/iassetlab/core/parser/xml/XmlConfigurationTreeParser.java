package com.iassetlab.core.parser.xml;

import com.iassetlab.core.ConfigurationTree;
import com.iassetlab.core.Diversifier;
import com.iassetlab.core.Property;
import com.iassetlab.core.Reference;
import com.iassetlab.core.parser.ConfigurationParseException;
import com.iassetlab.core.parser.ConfigurationTreeParser;
import com.iassetlab.core.parser.DataPath;
import org.apache.commons.io.IOUtils;
import org.w3c.dom.Document;
import org.w3c.dom.Element;
import org.w3c.dom.NodeList;
import org.xml.sax.SAXException;

import javax.xml.parsers.DocumentBuilder;
import javax.xml.parsers.DocumentBuilderFactory;
import javax.xml.parsers.ParserConfigurationException;
import java.io.IOException;
import java.io.InputStream;
import java.util.ArrayList;

/**
 * Created with IntelliJ IDEA.
 * User: chris
 * Date: 25/02/13
 * Time: 3:30 PM
 * To change this template use File | Settings | File Templates.
 */
public class XmlConfigurationTreeParser implements ConfigurationTreeParser {

    private static final String CONFIGURATION_TREE_ELEMENT_NAME   = "config";
    private static final String CONFIGURATION_TREE_NAME_ATTRIBUTE = "name";

    private static final String PROPERTY_ELEMENT_NAME               = "property";
    private static final String PROPERTY_KEY_ATTRIBUTE              = "key";
    private static final String PROPERTY_NAME_ATTRIBUTE             = "name";

    private static final String REFERENCE_ELEMENT_NAME              = "reference";
    private static final String REFERENCE_KEY_ATTRIBUTE             = "key";

    private static final String DIVERSIFIER_ELEMENT_NAME            = "diversifier";
    private static final String DIVERSIFIER_KEY_ATTRIBUTE           = "key";
    private static final String DIVERSIFIER_PATH_ATTRIBUTE          = "path";


    private DocumentBuilderFactory documentBuilderFactory;

    public XmlConfigurationTreeParser(DocumentBuilderFactory documentBuilderFactory) {
        this.documentBuilderFactory = documentBuilderFactory;
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

        NodeList propertyNodes = configurationTreeElement.getElementsByTagName(PROPERTY_ELEMENT_NAME);
        ArrayList<Property> properties = new ArrayList<>(propertyNodes.getLength());
        for( int i=0; i<propertyNodes.getLength(); i++ ) {
            Element propertyElement = (Element)propertyNodes.item(i);
            Property property = parseProperty(path, propertyElement);
            properties.add(property);
        }

        NodeList referenceNodes = configurationTreeElement.getElementsByTagName(REFERENCE_ELEMENT_NAME);
        ArrayList<Reference> references = new ArrayList<>(referenceNodes.getLength());
        for( int i=0; i<referenceNodes.getLength(); i++ ) {
            Element referenceElement = (Element)referenceNodes.item(i);
            Reference reference = parseReference(path, referenceElement);
            references.add(reference);
        }

        NodeList diversifierNodes = configurationTreeElement.getElementsByTagName(DIVERSIFIER_ELEMENT_NAME);
        ArrayList<Diversifier> diversifiers = new ArrayList<>(diversifierNodes.getLength());
        for( int i=0; i<diversifierNodes.getLength(); i++ ) {
            Element diversifierElement = (Element)diversifierNodes.item(i);
            Diversifier diversifier = parseDiversifier(path, diversifierElement);
            diversifiers.add(diversifier);
        }

        return new ConfigurationTree(name, properties, references, diversifiers);
    }

    public Property parseProperty(DataPath path, Element propertyElement) throws ConfigurationParseException, IOException {
        String key = propertyElement.getAttribute(PROPERTY_KEY_ATTRIBUTE);
        String name = propertyElement.getAttribute(PROPERTY_NAME_ATTRIBUTE);
        String value = propertyElement.getTextContent();
        return new Property(key, name, value);
    }

    public Diversifier parseDiversifier(DataPath path, Element diversifierElement) throws ConfigurationParseException, IOException {
        String key = diversifierElement.getAttribute(DIVERSIFIER_KEY_ATTRIBUTE);
        NodeList configurationTreeNodes = diversifierElement.getElementsByTagName(CONFIGURATION_TREE_ELEMENT_NAME);
        ArrayList<ConfigurationTree> configurationTrees = new ArrayList<>(configurationTreeNodes.getLength());
        for( int i=0; i<configurationTreeNodes.getLength(); i++ ) {
            Element configurationTreeElement = (Element)configurationTreeNodes.item(i);
            ConfigurationTree configurationTree = parseConfigurationTree(path, configurationTreeElement);
            configurationTrees.add(configurationTree);
        }
        return new Diversifier(key, configurationTrees);
    }

    public Reference parseReference(DataPath path, Element referenceElement) throws ConfigurationParseException, IOException {
        String key = referenceElement.getAttribute(DIVERSIFIER_KEY_ATTRIBUTE);
        String reference = referenceElement.getAttribute(DIVERSIFIER_PATH_ATTRIBUTE);
        ConfigurationTree configurationTree;
        if( path == null ) {
            // does it contain a configuration node?
            NodeList configurationTreeNodes = referenceElement.getElementsByTagName(CONFIGURATION_TREE_ELEMENT_NAME);
            if( configurationTreeNodes.getLength() == 1 ) {
                Element configurationTreeElement = (Element)configurationTreeNodes.item(0);
                configurationTree = parseConfigurationTree(path, configurationTreeElement);
            } else {
                throw new ConfigurationParseException("found "+configurationTreeNodes.getLength()+" reference elements, expected 1");
            }
        } else {
            DataPath referencePath = path.getRelativePath(reference);
            configurationTree = parse(referencePath);
        }
        return new Reference(key,  configurationTree);
    }
}
