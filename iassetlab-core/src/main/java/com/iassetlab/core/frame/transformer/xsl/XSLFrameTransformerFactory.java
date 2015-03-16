package com.iassetlab.core.frame.transformer.xsl;

import com.iassetlab.core.AssetContext;
import com.iassetlab.core.AssetValue;
import com.iassetlab.core.IAssetLabConstants;
import com.iassetlab.core.DataPath;
import com.iassetlab.core.frame.transformer.FrameTransformer;
import com.iassetlab.core.frame.transformer.FrameTransformerConfigurationException;
import com.iassetlab.core.frame.transformer.FrameTransformerFactory;

import javax.xml.transform.Source;
import javax.xml.transform.Transformer;
import javax.xml.transform.TransformerConfigurationException;
import javax.xml.transform.TransformerFactory;
import javax.xml.transform.stream.StreamSource;
import java.io.IOException;
import java.io.InputStream;
import java.util.Collection;

/**
 * Created with IntelliJ IDEA.
 * User: chris
 * Date: 28/02/13
 * Time: 10:07 AM
 * To change this template use File | Settings | File Templates.
 */
public class XSLFrameTransformerFactory implements FrameTransformerFactory {

    private TransformerFactory transformerFactory;
    private String defaultMimeType;

    public XSLFrameTransformerFactory(TransformerFactory transformerFactory, String defaultMimeType) {
        this.transformerFactory = transformerFactory;
        this.defaultMimeType = defaultMimeType;
    }

    @Override
    public FrameTransformer create(DataPath dataPath, AssetContext context) throws FrameTransformerConfigurationException, IOException {

        String mimeType;
        AssetValue mimeTypeAssetValue = context.get(IAssetLabConstants.KEY_TEMPLATE_XSL_OUTPUT_MIME_TYPE);
        if( mimeTypeAssetValue != null ) {
            mimeType = mimeTypeAssetValue.getValue(context);
        } else {
            // TODO guess the output type based on the input XSL template?
            mimeType = this.defaultMimeType;
        }

        Transformer transformer;
        // get the XSL file
        AssetValue xslFileAssetValue = context.get(IAssetLabConstants.KEY_TEMPLATE_XSL_PATH);
        if( xslFileAssetValue == null ) {
            try {
                transformer = transformerFactory.newTransformer();
            } catch( TransformerConfigurationException ex ) {
                throw new FrameTransformerConfigurationException(ex);
            }
        } else {
            String xslFile = xslFileAssetValue.getValue(context);
            DataPath xslDataPath = xslFileAssetValue.getSourceDataPath().getRelativePath(xslFile);
            InputStream xslInputStream = xslDataPath.open();
            try {
                Source xslSource = new StreamSource(xslInputStream, xslDataPath.toAbsolutePath());
                transformer = transformerFactory.newTransformer(xslSource);
            } catch( TransformerConfigurationException ex ) {
                throw new FrameTransformerConfigurationException(xslFile, ex);
            } finally {
                xslInputStream.close();
            }
        }
        Collection<String> keys = context.getKeys();
        for( String key : keys ) {
            AssetValue assetValue = context.get(key);
            String value = assetValue.getValue(context);
            // set the name and the absolute path for the value
            // TODO handle types (eg relative paths)
            // TODO this should be done internally to the value!
//            DataPath sourceDataPath = assetValue.getSourceDataPath();
//            if( sourceDataPath != null ) {
//                DataPath assetPath = sourceDataPath.getRelativePath(value);
//                transformer.setParameter(key+"._path", assetPath.toAbsolutePath());
//            }

            String name = assetValue.getName(context );
            if( name != null ) {
                transformer.setParameter(key+"._name", name);
            }
            transformer.setParameter(key, value);
        }
        return new XSLFrameTransformer(transformer, mimeType);
    }
}
