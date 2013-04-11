package com.iassetlab.cli;

import com.beust.jcommander.DynamicParameter;
import com.beust.jcommander.JCommander;
import com.beust.jcommander.Parameter;
import com.beust.jcommander.ParameterException;
import com.iassetlab.core.*;
import com.iassetlab.core.data.*;
import com.iassetlab.core.frame.FrameGeneratorFactory;
import com.iassetlab.core.frame.FrameMetadataFactory;
import com.iassetlab.core.frame.consumer.DelegatingFrameConsumer;
import com.iassetlab.core.frame.consumer.factory.FileFrameConsumerFactory;
import com.iassetlab.core.frame.consumer.factory.SmartImageFrameConsumerFactory;
import com.iassetlab.core.frame.metadata.DataPathFrameMetadataFactory;
import com.iassetlab.core.frame.transformer.XSLSVGImagePipelineFrameGeneratorFactory;
import com.iassetlab.core.parser.xml.VelocityAssetValueFactory;
import com.iassetlab.core.parser.xml.XmlConfigurationTreeParser;
import com.iassetlab.core.value.SimpleAssetValue;
import org.apache.velocity.app.VelocityEngine;
import org.apache.velocity.tools.generic.MathTool;

import javax.xml.parsers.DocumentBuilderFactory;
import javax.xml.transform.TransformerFactory;
import java.io.File;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * Created with IntelliJ IDEA.
 * User: chris
 * Date: 25/02/13
 * Time: 5:23 PM
 * To change this template use File | Settings | File Templates.
 */
public class Main {

    public static class CommandLineParameters {

        @Parameter(names = "-out", description = "Output directory (defaults to current)", required = false)
        private String targetDirectory;

        @Parameter(description = "Input XML file(s)", required = true)
        private List<String> inputFiles;

        @DynamicParameter(names = "-P", description = "Set additional parameters for the configuration")
        private Map<String, String> inputParameters;

        public CommandLineParameters(String targetDirectory) {
            this.targetDirectory = targetDirectory;
            this.inputFiles = new ArrayList<>();
            this.inputParameters = new HashMap<>();
        }

        public String getTargetDirectory() {
            return targetDirectory;
        }

        public List<String> getInputFiles() {
            return inputFiles;
        }

        public Map<String, String> getInputParameters() {
            return inputParameters;
        }
    }

    public static final void main(String[] args) throws Exception {
        String userDirectory = System.getProperty("user.dir");
        CommandLineParameters parameters = new CommandLineParameters(userDirectory);
        JCommander commander = new JCommander(parameters);
        try {
            commander.parse(args);
        } catch( ParameterException ex ) {
            ex.printStackTrace(System.err);
            commander.usage(Main.class.getName());
        }

        FileDataPath userDataPath = new FileDataPath(new File(userDirectory));

        Map<String, String> inputParameters = parameters.getInputParameters();
        HashMap<String, AssetValue> assetValues = new HashMap<>(inputParameters.size());
        for( Map.Entry<String, String> inputParameter : inputParameters.entrySet() ) {
            String key = inputParameter.getKey();
            String value = inputParameter.getValue();
            assetValues.put(key, new SimpleAssetValue(userDataPath, key, null, value));
        }

        FrameMetadataFactory frameMetadataFactory = new DataPathFrameMetadataFactory(
                IAssetLabConstants.KEY_XML_PATH,
                "text/xml",
                "res:default.xml"
        );
        TransformerFactory transformerFactory = TransformerFactory.newInstance();
        // TODO configure the URL handlers in the transformer factory?
        FileDataPathFactory fileDataPathFactory = new FileDataPathFactory(
                new FileDataPath(new File(userDirectory))
        );
        ResourceDataPathFactory resourceDataPathFactory = new ResourceDataPathFactory(
                AssetGenerator.class.getClassLoader()
        );
        // TODO should probably have a URL one as well
        HashMap<String, DataPathFactory> dataPathFactories = new HashMap<>(2);
        dataPathFactories.put("file", fileDataPathFactory);
        dataPathFactories.put("res", resourceDataPathFactory);
        ProtocolAwareDataPathFactoryProxy xmlDataPathFactory = new ProtocolAwareDataPathFactoryProxy(
                dataPathFactories,
                "file"
        );
        // TODO configure the URL handlers in Batik?
        FrameGeneratorFactory frameGeneratorFactory = new XSLSVGImagePipelineFrameGeneratorFactory(
                frameMetadataFactory,
                transformerFactory,
                "image/svg+xml",
                "image",
                "png"
        );


        AssetGenerator assetGenerator = new AssetGenerator(frameGeneratorFactory, assetValues);
        // TODO configure the velocity engine properly
        XmlConfigurationTreeParser parser = new XmlConfigurationTreeParser(DocumentBuilderFactory.newInstance(), VelocityAssetValueFactory.getInstance());

        List<String> inputFiles = parameters.getInputFiles();
        ArrayList<ConfigurationTree> configurations = new ArrayList<>(inputFiles.size());
        for( String inputFile : inputFiles ) {
            DataPath inputDataPath = xmlDataPathFactory.getDataPath(inputFile);
            ConfigurationTree configuration = parser.parse(inputDataPath);
            configurations.add(configuration);
        }

        FileFrameConsumerFactory fileFrameConsumerFactory = new FileFrameConsumerFactory(
                new File(parameters.getTargetDirectory()),
                true
        );
        SmartImageFrameConsumerFactory smartImageFrameConsumerFactory = new SmartImageFrameConsumerFactory(
                fileFrameConsumerFactory
        );
        DelegatingFrameConsumer frameConsumer = new DelegatingFrameConsumer(
                smartImageFrameConsumerFactory
        );

        assetGenerator.generate(configurations, frameConsumer);
    }

}
