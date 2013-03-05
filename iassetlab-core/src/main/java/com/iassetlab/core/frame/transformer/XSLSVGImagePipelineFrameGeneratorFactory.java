package com.iassetlab.core.frame.transformer;

import com.iassetlab.core.AssetContext;
import com.iassetlab.core.data.DataPathFactory;
import com.iassetlab.core.frame.FrameGenerator;
import com.iassetlab.core.frame.FrameGeneratorConfigurationException;
import com.iassetlab.core.frame.FrameGeneratorFactory;
import com.iassetlab.core.frame.FrameMetadataFactory;
import com.iassetlab.core.frame.transformer.batik.BatikFrameTransformerFactory;
import com.iassetlab.core.frame.transformer.xsl.XSLFrameTransformerFactory;
import com.iassetlab.core.util.FileFeatureUtil;

import javax.xml.transform.TransformerFactory;
import java.util.ArrayList;

/**
 * Created with IntelliJ IDEA.
 * User: chris
 * Date: 1/03/13
 * Time: 4:46 PM
 * To change this template use File | Settings | File Templates.
 */
public class XSLSVGImagePipelineFrameGeneratorFactory implements FrameGeneratorFactory {

    private FrameMetadataFactory frameMetadataFactory;
    private TransformerFactory transformerFactory;
    private String defaultXSLOutputMimeType;
    private String imageMimeTypePrefix;
    private String defaultImageInformalSuffix;

    public XSLSVGImagePipelineFrameGeneratorFactory(
            FrameMetadataFactory frameMetadataFactory,
            TransformerFactory transformerFactory,
            String defaultXSLOutputMimeType,
            String imageMimeTypePrefix,
            String defaultImageInformalSuffix
    ) {
        this.frameMetadataFactory = frameMetadataFactory;
        this.transformerFactory = transformerFactory;
        this.defaultXSLOutputMimeType = defaultXSLOutputMimeType;
        this.defaultImageInformalSuffix = defaultImageInformalSuffix;
        this.imageMimeTypePrefix = imageMimeTypePrefix;
    }

    @Override
    public FrameGenerator create(AssetContext assetContext) throws FrameGeneratorConfigurationException {
        ArrayList<FrameTransformerFactory> transformerFactories = new ArrayList<>();

        // xsl
        XSLFrameTransformerFactory xslFrameTransformerFactory = new XSLFrameTransformerFactory(transformerFactory, defaultXSLOutputMimeType);
        transformerFactories.add(xslFrameTransformerFactory);

        String outputMimeType = FileFeatureUtil.getOutputMimeType(assetContext, this.imageMimeTypePrefix);
        if( outputMimeType != null && outputMimeType.startsWith(this.imageMimeTypePrefix+"/") && !outputMimeType.endsWith("+xml") ) {
            // add in the batik transformer
            BatikFrameTransformerFactory batikFrameTransformerFactory = new BatikFrameTransformerFactory(this.imageMimeTypePrefix, defaultImageInformalSuffix);
            transformerFactories.add(batikFrameTransformerFactory);
        }

        TransformerPipelineFrameGenerator frameGenerator = new TransformerPipelineFrameGenerator(this.frameMetadataFactory, transformerFactories);
        return frameGenerator;
    }


}
