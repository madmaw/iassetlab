package com.iassetlab.core.frame.transformer;

import com.iassetlab.core.AssetContext;
import com.iassetlab.core.data.DataPath;
import com.iassetlab.core.frame.FrameGenerationException;
import com.iassetlab.core.frame.FrameGenerator;
import com.iassetlab.core.frame.FrameMetadata;
import com.iassetlab.core.frame.FrameMetadataFactory;
import org.apache.commons.io.IOUtils;

import java.io.*;
import java.util.List;

/**
 * Created with IntelliJ IDEA.
 * User: chris
 * Date: 28/02/13
 * Time: 9:43 AM
 * To change this template use File | Settings | File Templates.
 */
public class TransformerPipelineFrameGenerator implements FrameGenerator {

    private List<FrameTransformerFactory> transformerFactories;
    private FrameMetadataFactory inputMetadataFactory;

    public TransformerPipelineFrameGenerator(FrameMetadataFactory inputMetadataFactory, List<FrameTransformerFactory> transformerFactories) {
        this.inputMetadataFactory = inputMetadataFactory;
        this.transformerFactories = transformerFactories;
    }

    @Override
    public FrameMetadata generate(DataPath systemPath, AssetContext context, OutputStream outs) throws IOException, FrameGenerationException {
        FrameMetadata inputMetadata = this.inputMetadataFactory.create(systemPath, context);
        byte[] data;
        InputStream ins = inputMetadata.getDataPath().open();
        try {
            data = IOUtils.toByteArray(ins);
        } finally {
            IOUtils.closeQuietly(ins);
        }
        for( int i=0; i<this.transformerFactories.size(); i++ ) {
            FrameTransformerFactory transformerFactory = this.transformerFactories.get(i);
            try {
                FrameTransformer transformer = transformerFactory.create(context);
                ByteArrayOutputStream bos = new ByteArrayOutputStream();
                inputMetadata = transformer.transform(new ByteArrayInputStream(data), inputMetadata, bos);
                data = bos.toByteArray();
            } catch( FrameTransformerConfigurationException ex ) {
                throw new FrameGenerationException(ex);
            } catch( FrameTransformationException ex ) {
                throw new FrameGenerationException(ex);
            }
        }
        outs.write(data);
        return inputMetadata;
    }
}
