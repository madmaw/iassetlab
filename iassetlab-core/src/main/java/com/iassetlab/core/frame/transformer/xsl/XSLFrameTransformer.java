package com.iassetlab.core.frame.transformer.xsl;

import com.iassetlab.core.frame.FrameMetadata;
import com.iassetlab.core.frame.transformer.FrameTransformationException;
import com.iassetlab.core.frame.transformer.FrameTransformer;

import javax.xml.transform.Transformer;
import javax.xml.transform.TransformerException;
import javax.xml.transform.stream.StreamResult;
import javax.xml.transform.stream.StreamSource;
import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;

/**
 * Created with IntelliJ IDEA.
 * User: chris
 * Date: 28/02/13
 * Time: 10:04 AM
 * To change this template use File | Settings | File Templates.
 */
public class XSLFrameTransformer implements FrameTransformer {

    private Transformer transformer;
    private String mimeType;

    public XSLFrameTransformer(Transformer transformer, String mimeType) {
        this.transformer = transformer;
        this.mimeType = mimeType;
    }

    @Override
    public FrameMetadata transform(InputStream inputStream, FrameMetadata inputMetadata, OutputStream outputStream) throws IOException, FrameTransformationException {
        String systemId = inputMetadata.getDataPath().toAbsolutePath();
        StreamSource inputSource = new StreamSource(inputStream, systemId);
        StreamResult outputResult = new StreamResult(outputStream);
        try {
            this.transformer.transform(inputSource, outputResult);
        } catch( TransformerException ex) {
            throw new FrameTransformationException(systemId, ex);
        }
        return new FrameMetadata(this.mimeType, inputMetadata.getDataPath());
    }
}
