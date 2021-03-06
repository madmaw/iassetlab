package com.iassetlab.core.parser.xml;

import com.iassetlab.core.*;
import com.iassetlab.core.parser.ConfigurationParseException;
import com.iassetlab.core.parser.ConfigurationTreeParser;
import com.iassetlab.core.value.AbsolutePathAssetValueProxy;
import com.iassetlab.core.value.ImageDimensionValue;
import com.iassetlab.core.value.SimpleAssetValue;
import net.glxn.qrgen.core.AbstractQRCode;
import net.glxn.qrgen.core.image.ImageType;
import net.glxn.qrgen.javase.QRCode;
import org.apache.batik.util.Base64EncoderStream;
import org.apache.commons.codec.binary.Base64;
import org.apache.commons.io.IOUtils;
import org.apache.commons.io.input.BOMInputStream;
import org.w3c.dom.*;
import org.xml.sax.SAXException;

import javax.xml.parsers.DocumentBuilder;
import javax.xml.parsers.DocumentBuilderFactory;
import javax.xml.parsers.ParserConfigurationException;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;

/**
 * Created with IntelliJ IDEA.
 * User: chris
 * Date: 25/02/13
 * Time: 3:30 PM
 * To change this template use File | Settings | File Templates.
 */
public class XmlConfigurationTreeParser implements ConfigurationTreeParser {



    private static final String CONFIGURATION_TREE_ELEMENT_NAME     = "configuration";
    private static final String CONFIGURATION_TREE_NAME_ATTRIBUTE   = "name";

    private static final String PROPERTY_ELEMENT_NAME               = "property";
    private static final String PROPERTY_KEY_ATTRIBUTE              = "key";
    private static final String PROPERTY_NAME_ATTRIBUTE             = "name";
    private static final String PROPERTY_IS_RELATIVE_PATH           = "is_relative_path";
    private static final String PROPERTY_TYPE                       = "type";

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

    public ConfigurationTree parseConfigurationTree(final DataPath path, Element configurationTreeElement) throws ConfigurationParseException, IOException {
        String name = configurationTreeElement.getAttribute(CONFIGURATION_TREE_NAME_ATTRIBUTE);

        List<Element> propertyNodes = getElementsByTagName(configurationTreeElement, PROPERTY_ELEMENT_NAME);
        ArrayList<ConfigurationTree.Property> properties = new ArrayList<ConfigurationTree.Property>(propertyNodes.size());
        for( int i=0; i<propertyNodes.size(); i++ ) {
            Element propertyElement = propertyNodes.get(i);
            final ConfigurationTree.Property property = parseProperty(path, propertyElement);
            if( "image-path".equals(property.getType()) ) {
                // add in additional properties for image width and height
                String imageWidthName = property.getKey() + "-width";
                String imageHeightName = property.getKey() + "-height";
                final String imageURIName = property.getKey() + "-uri";

                properties.add(new ConfigurationTree.Property(imageWidthName, null, new ImageDimensionValue(path, property.getAssetValue(), imageWidthName, ImageDimensionValue.DIMENSION_WIDTH)));
                properties.add(new ConfigurationTree.Property(imageHeightName, null, new ImageDimensionValue(path, property.getAssetValue(), imageHeightName, ImageDimensionValue.DIMENSION_HEIGHT)));
                properties.add(new ConfigurationTree.Property(imageURIName, null, new AssetValue() {
                    @Override
                    public DataPath getSourceDataPath() {
                        return path;
                    }

                    @Override
                    public String getValue(AssetContext context) {
                        String originalPath = property.getAssetValue().getValue(context);
                        return path.getRelativePath(originalPath).toAbsolutePath();
                    }

                    @Override
                    public String getName(AssetContext context) {
                        return imageURIName;
                    }
                }));
            } else if( "qrcode".equals(property.getType()) ) {
                final String widthKey = property.getAttribute("widthKey");
                final String heightKey = property.getAttribute("heightKey");
                final String foregroundKey = property.getAttribute("foregroundKey");
                final String backgroundKey = property.getAttribute("backgroundKey");
                final String imageTypeKey = property.getAttribute("imageTypeKey");

                final String imageURIName = property.getKey() + "-uri";

                properties.add(new ConfigurationTree.Property(imageURIName, null, new AssetValue() {
                    @Override
                    public DataPath getSourceDataPath() {
                        return path;
                    }

                    @Override
                    public String getValue(AssetContext context) {
                        String value = property.getAssetValue().getValue(context);

                        AbstractQRCode qrcode = QRCode.from(value);

                        AssetValue widthAsset = context.get(widthKey);
                        Integer width;
                        if(widthAsset != null ) {
                            String widthString = widthAsset.getValue(context);
                            if( widthString != null ) {
                                width = Integer.parseInt(widthString);
                            } else {
                                width = null;
                            }

                        } else {
                            width = null;
                        }
                        Integer height;
                        AssetValue heightAsset = context.get(heightKey);
                        if( heightAsset != null ) {
                            String heightString = heightAsset.getValue(context);
                            if( heightString != null ) {
                                height = Integer.parseInt(heightString);
                            } else {
                                height = null;
                            }
                        } else {
                            height = null;
                        }

                        if( width != null ) {
                            if( height == null ) {
                                height = width;
                            }
                        } else {
                            if( height != null ) {
                                width = height;
                            }
                        }
                        if( width != null && height != null ) {
                            qrcode = qrcode.withSize(width, height);
                        }

                        /* needs later version???
                        AssetValue backgroundAsset = context.get(backgroundKey);
                        if( backgroundAsset != null ) {
                            String backgroundString = backgroundAsset.getValue(context);
                            if( backgroundString != null ) {

                            }
                        }
                        */

                        ImageType imageType = ImageType.PNG;
                        AssetValue imageTypeAsset = context.get(imageTypeKey);
                        if( imageTypeAsset != null ) {
                            String imageTypeString = imageTypeAsset.getValue(context);
                            if( imageTypeString != null ) {
                                imageType = ImageType.valueOf(imageTypeString);
                            }
                        }
                        qrcode = qrcode.to(imageType);

                        ByteArrayOutputStream bos = qrcode.stream();
                        String base64 = Base64.encodeBase64String(bos.toByteArray());
                        String dataURI = "data:image/"+imageType.name().toLowerCase()+";base64,"+base64;
                        return dataURI;
                    }

                    @Override
                    public String getName(AssetContext context) {
                        return imageURIName;
                    }
                }));

            }
            properties.add(property);
        }

        List<Element> referenceNodes = getElementsByTagName(configurationTreeElement, REFERENCE_ELEMENT_NAME);
        ArrayList<Reference> references = new ArrayList<Reference>(referenceNodes.size());
        for( int i=0; i<referenceNodes.size(); i++ ) {
            Element referenceElement = referenceNodes.get(i);
            Reference reference = parseReference(path, referenceElement);
            references.add(reference);
        }

        List<Element> diversifierNodes = getElementsByTagName(configurationTreeElement, DIVERSIFIER_ELEMENT_NAME);
        ArrayList<Diversifier> diversifiers = new ArrayList<Diversifier>(diversifierNodes.size());
        for( int i=0; i<diversifierNodes.size(); i++ ) {
            Element diversifierElement = diversifierNodes.get(i);
            Diversifier diversifier = parseDiversifier(path, diversifierElement);
            diversifiers.add(diversifier);
        }

        return new ConfigurationTree(path, name, properties, references, diversifiers);
    }

    public ConfigurationTree.Property parseProperty(DataPath dataPath, Element propertyElement) throws ConfigurationParseException, IOException {
        String key = propertyElement.getAttribute(PROPERTY_KEY_ATTRIBUTE);
        String name = propertyElement.getAttribute(PROPERTY_NAME_ATTRIBUTE);
        String isRelativePath = propertyElement.getAttribute(PROPERTY_IS_RELATIVE_PATH);
        String type = propertyElement.getAttribute(PROPERTY_TYPE);

        NamedNodeMap propertyElementAttributes = propertyElement.getAttributes();
        HashMap<String, String> attributes = new HashMap<String, String>(propertyElementAttributes.getLength());
        for( int i=0; i<propertyElementAttributes.getLength(); i++ ) {
            Attr node = (Attr)propertyElementAttributes.item(i);
            attributes.put(node.getName(), node.getValue());
        }

        // image is a special type
        String value = propertyElement.getTextContent();
        try {
            // probably should just have things like "type" as name-value pairs
            AssetValue assetValue = assetValueFactory.create(dataPath, name, value, type);
            if( "true".equalsIgnoreCase(isRelativePath) ) {
                // hack to allow well-behaved paths to be specified in XML
                assetValue = new AbsolutePathAssetValueProxy(assetValue);
            }
            return new ConfigurationTree.Property(key, type, assetValue, attributes);
        } catch( InvalidAssetValueTemplateException ex ) {
            throw new ConfigurationParseException(ex);
        }
    }

    public Diversifier parseDiversifier(DataPath path, Element diversifierElement) throws ConfigurationParseException, IOException {
        String key = diversifierElement.getAttribute(DIVERSIFIER_KEY_ATTRIBUTE);
        List<Element> configurationTreeNodes = getElementsByTagName(diversifierElement, CONFIGURATION_TREE_ELEMENT_NAME);
        ArrayList<ConfigurationTree> configurationTrees = new ArrayList<ConfigurationTree>(configurationTreeNodes.size());
        for( int i=0; i<configurationTreeNodes.size(); i++ ) {
            Element configurationTreeElement = configurationTreeNodes.get(i);
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
                Element configurationTreeElement = configurationTreeNodes.get(0);
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

        ArrayList<Element> result = new ArrayList<Element>();
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
