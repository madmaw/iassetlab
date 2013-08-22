package com.iassetlab.core.frame.transformer.batik;

import com.iassetlab.core.frame.FrameMetadata;
import com.iassetlab.core.frame.transformer.FrameTransformationException;
import com.iassetlab.core.frame.transformer.FrameTransformer;
import org.apache.batik.bridge.*;
import org.apache.batik.dom.svg.SAXSVGDocumentFactory;
import org.apache.batik.dom.svg.SVGOMSVGElement;
import org.apache.batik.ext.awt.image.GraphicsUtil;
import org.apache.batik.gvt.GraphicsNode;
import org.apache.batik.util.XMLResourceDescriptor;
import org.apache.commons.io.IOUtils;
import org.w3c.dom.svg.SVGDocument;

import javax.imageio.ImageIO;
import java.awt.*;
import java.awt.image.BufferedImage;
import java.io.*;

/**
 * Created with IntelliJ IDEA.
 * User: chris
 * Date: 28/02/13
 * Time: 10:04 AM
 * To change this template use File | Settings | File Templates.
 */
public class BatikFrameTransformer implements FrameTransformer {

    public static interface Scaler {
        double getXScale(int nativeWidth, int nativeHeight);

        double getYScale(int nativeWidth, int nativeHeight);
    }

    private Float animationDuration;
    private Scaler scaler;
    private RenderingHints renderingHints;
    private String outputMimeType;
    private String outputInformalName;


    public BatikFrameTransformer(Float animationDuration, Scaler scaler, RenderingHints renderingHints, String outputMimeType, String outputInformalName) {
        this.animationDuration = animationDuration;
        this.renderingHints = renderingHints;
        this.scaler = scaler;
        this.outputInformalName = outputInformalName;
        this.outputMimeType = outputMimeType;

    }

    @Override
    public FrameMetadata transform(InputStream inputStream, FrameMetadata inputMetadata, OutputStream outputStream) throws IOException, FrameTransformationException {

        byte[] data = IOUtils.toByteArray(inputStream);
        System.out.println( new String(data) );
        inputStream = new ByteArrayInputStream(data);
        try {
            String parser = XMLResourceDescriptor.getXMLParserClassName();
            SAXSVGDocumentFactory f = new SAXSVGDocumentFactory(parser);
            SVGDocument svgDocument;
            String docBaseUri = inputMetadata.getDataPath().toAbsolutePath();
            try {
                svgDocument = f.createSVGDocument(docBaseUri, inputStream);
            } catch( Exception ex ) {
                // TODO could be more friendly (include SVG)
                throw new FrameTransformationException("unable to parse svg "+docBaseUri, ex);
            }

            UserAgentAdapter userAgent = new UserAgentAdapter();
            DocumentLoader loader = new DocumentLoader(userAgent);
            GVTBuilder builder = new GVTBuilder();
            BridgeContext ctx = new BridgeContext(userAgent, loader);
            ctx.setDynamicState(BridgeContext.DYNAMIC);
            GraphicsNode rootGN;
            try {
                rootGN = builder.build(ctx, svgDocument);
                rootGN.setRenderingHints(renderingHints);
            } catch( Exception ex ) {
                // TODO should include that invalid SVG!
                throw new FrameTransformationException( "invalid SVG "+docBaseUri, ex );
            }


            if(animationDuration != null) {
                SVGAnimationEngine animationEngine = ctx.getAnimationEngine();
                if( !animationEngine.hasStarted() ) {
                    animationEngine.start(System.currentTimeMillis());
                }
                if( !animationEngine.isPaused() ) {
                    animationEngine.pause();
                }
                animationEngine.setCurrentTime(animationDuration);
            }

            SVGOMSVGElement element = (SVGOMSVGElement)svgDocument.getDocumentElement();
            int width = (int)Math.ceil(element.getWidth().getBaseVal().getValueInSpecifiedUnits());
            int height = (int)Math.ceil(element.getHeight().getBaseVal().getValueInSpecifiedUnits());
            if( width > 0 && height > 0 ) {
                BufferedImage image = new BufferedImage(width, height, BufferedImage.TYPE_INT_ARGB);
                Graphics2D g = GraphicsUtil.createGraphics(image);
                g.addRenderingHints(renderingHints);
                rootGN.paint(g);
                g.dispose();

                double scaleX = scaler.getXScale(width, height);
                double scaleY = scaler.getYScale(width, height);

                int scaledWidth = (int)Math.round(scaleX*((double)width));
                int scaledHeight = (int)Math.round(scaleY*((double)height));
                if( scaledWidth >0 && scaledHeight > 0 ) {
                    if( scaledWidth != width || scaledHeight != height ) {
                        Image toWrite;
                        toWrite = image.getScaledInstance(scaledWidth, scaledHeight, Image.SCALE_SMOOTH);
                        image = new BufferedImage(scaledWidth, scaledHeight, BufferedImage.TYPE_INT_ARGB);
                        image.getGraphics().drawImage(toWrite, 0, 0, null);
                    }

                    ImageIO.write(image, this.outputInformalName, outputStream);
                    return new FrameMetadata(this.outputMimeType, inputMetadata.getDataPath());
                } else {
                    return null;
                }
            } else {
                return null;
            }
        } catch( RuntimeException ex ) {
            throw new RuntimeException(new String(data), ex);
        }
    }
}
