package com.iassetlab.core.frame.consumer.factory;

import com.iassetlab.core.AssetContext;
import com.iassetlab.core.frame.FrameConsumer;
import com.iassetlab.core.frame.consumer.FileFrameConsumer;
import com.iassetlab.core.frame.consumer.FrameConsumerFactory;
import com.iassetlab.core.util.FileFeatureUtil;

import java.io.File;

/**
 * Created with IntelliJ IDEA.
 * User: chris
 * Date: 5/03/13
 * Time: 4:43 PM
 * To change this template use File | Settings | File Templates.
 */
public class FileFrameConsumerFactory implements FrameConsumerFactory {

    private File directory;

    public FileFrameConsumerFactory(File directory) {
        this.directory = directory;
    }

    @Override
    public FrameConsumer create(AssetContext context) {
        return new FileFrameConsumer(directory);
    }
}
