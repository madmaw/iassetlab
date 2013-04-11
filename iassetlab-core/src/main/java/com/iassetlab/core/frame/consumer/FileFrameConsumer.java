package com.iassetlab.core.frame.consumer;

import com.iassetlab.core.AssetContext;
import com.iassetlab.core.AssetValue;
import com.iassetlab.core.IAssetLabConstants;
import com.iassetlab.core.frame.FrameConsumer;
import com.iassetlab.core.util.FileFeatureUtil;
import org.apache.commons.io.IOUtils;

import java.io.*;
import java.util.Comparator;

/**
 * Created with IntelliJ IDEA.
 * User: chris
 * Date: 27/02/13
 * Time: 1:46 PM
 * To change this template use File | Settings | File Templates.
 */
public class FileFrameConsumer extends AbstractFrameConsumer {

    private File directory;
    private boolean append;
    private boolean first;

    public FileFrameConsumer(File directory, boolean append) {
        this.directory = directory;
        this.append = append;
        this.first = true;
    }

    @Override
    public void consume(AssetContext context, InputStream frameData, String mimeType) throws IOException {
        // get the file name
        String filename = FileFeatureUtil.getOutputFileName(context);
        int lastSlashIndex = filename.lastIndexOf('/');
        File fileDirectory;
        String fileFilename;
        if( lastSlashIndex >= 0 ) {
            String fileDirectoryPath = filename.substring(0, lastSlashIndex);
            fileFilename = filename.substring(lastSlashIndex+1);
            if( fileDirectoryPath.startsWith("/") ) {
                fileDirectory = new File(fileDirectoryPath);
            } else {
                fileDirectory = new File(directory, fileDirectoryPath);
            }
        } else {
            fileDirectory = directory;
            fileFilename = filename;
        }
        fileDirectory.mkdirs();
        File file = new File(fileDirectory, fileFilename);

        OutputStream outs = new FileOutputStream(file, this.append && !this.first);
        this.first = false;
        try {
            IOUtils.copy(frameData, outs);
        } finally {
            IOUtils.closeQuietly(outs);
        }
    }

    @Override
    public void close() {

    }

}
