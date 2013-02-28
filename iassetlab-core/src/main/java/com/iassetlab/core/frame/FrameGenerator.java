package com.iassetlab.core.frame;

import com.iassetlab.core.AssetContext;
import com.iassetlab.core.AssetValue;
import com.iassetlab.core.data.DataPath;

import java.io.IOException;
import java.io.OutputStream;
import java.util.Map;

/**
 * Created with IntelliJ IDEA.
 * User: chris
 * Date: 27/02/13
 * Time: 12:39 PM
 * To change this template use File | Settings | File Templates.
 */
public interface FrameGenerator {

    FrameMetadata generate(DataPath systemPath, AssetContext context, OutputStream outs) throws IOException, FrameGenerationException;

}
