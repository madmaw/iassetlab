package com.iassetlab.core.frame.transformer.xsl;

import com.iassetlab.core.AssetContext;
import com.iassetlab.core.AssetValue;
import com.iassetlab.core.IAssetLabConstants;
import com.iassetlab.core.data.DataPath;
import com.iassetlab.core.data.DataPathFactory;
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
    private DataPathFactory xslDataPathFactory;

    public XSLFrameTransformerFactory(TransformerFactory transformerFactory) {
        this.transformerFactory = transformerFactory;
    }

    @Override
    public FrameTransformer create(AssetContext context) throws FrameTransformerConfigurationException, IOException {

        // get the XSL file
        String xslFile = context.get(IAssetLabConstants.KEY_TEMPLATE_XSL_PATH).getValue(context);
        DataPath xslDataPath = xslDataPathFactory.getDataPath(xslFile);
        InputStream xslInputStream = xslDataPath.open();
        try {
            Source xslSource = new StreamSource(xslInputStream);
            Transformer transformer = transformerFactory.newTransformer(xslSource);
            Collection<String> keys = context.getKeys();
            for( String key : keys ) {
                AssetValue assetValue = context.get(key);
                String value = assetValue.getValue(context);
                transformer.setParameter(key, value);
            }
            return new XSLFrameTransformer(transformer);
        } catch( TransformerConfigurationException ex ) {
            throw new FrameTransformerConfigurationException(xslFile, ex);
        } finally {
            xslInputStream.close();
        }
    }
}
