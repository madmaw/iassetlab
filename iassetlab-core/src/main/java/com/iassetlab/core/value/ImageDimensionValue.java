package com.iassetlab.core.value;

import com.iassetlab.core.AssetContext;
import com.iassetlab.core.AssetValue;
import com.iassetlab.core.DataPath;

import javax.imageio.ImageIO;
import java.awt.*;
import java.awt.image.BufferedImage;

/**
 * Created with IntelliJ IDEA.
 * User: chris
 * Date: 3/07/13
 * Time: 4:02 PM
 * To change this template use File | Settings | File Templates.
 */
public class ImageDimensionValue implements AssetValue {

    public static final int DIMENSION_WIDTH     = 0;
    public static final int DIMENSION_HEIGHT    = 1;

    private DataPath sourceDataPath;
    private AssetValue pathAssetValue;
    private String name;
    private int dimension;

    public ImageDimensionValue(DataPath sourceDataPath, AssetValue pathAssetValue, String name, int dimension) {
        this.sourceDataPath = sourceDataPath;
        this.pathAssetValue = pathAssetValue;
        this.name = name;
        this.dimension = dimension;
    }

    @Override
    public DataPath getSourceDataPath() {
        return this.sourceDataPath;
    }

    @Override
    public String getValue(AssetContext context) {
        String path = this.pathAssetValue.getValue(context);
        DataPath imageDataPath = this.sourceDataPath.getRelativePath(path);
        try {
            BufferedImage image = ImageIO.read(imageDataPath.open());
            int result;
            if( this.dimension == DIMENSION_HEIGHT ) {
                result = image.getHeight();
            } else {
                result = image.getWidth();
            }
            return Integer.toString(result);
        } catch( Exception ex ) {
            throw new RuntimeException(ex);
        }
    }

    @Override
    public String getName(AssetContext context) {
        return this.name;
    }
}
