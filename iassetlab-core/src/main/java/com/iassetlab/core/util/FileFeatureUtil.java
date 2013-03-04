package com.iassetlab.core.util;

import com.iassetlab.core.AssetContext;
import com.iassetlab.core.AssetValue;
import com.iassetlab.core.IAssetLabConstants;

/**
 * Created with IntelliJ IDEA.
 * User: chris
 * Date: 4/03/13
 * Time: 4:39 PM
 * To change this template use File | Settings | File Templates.
 */
public class FileFeatureUtil {

    public static final String MIME_TYPE_CLASS_IMAGE = "image";

    public static final String MIME_TYPE_GIF = "image/gif";

    public static final String getOutputMimeType(AssetContext context) {
        return getOutputMimeType(context, MIME_TYPE_CLASS_IMAGE);
    }

    public static final boolean isBinaryImageMimeType(String mimeType) {
        return mimeType.startsWith(MIME_TYPE_CLASS_IMAGE+"/") && !mimeType.endsWith("+xml");
    }

    public static final String getOutputMimeType(AssetContext context, String expectedMimeClass) {
        String result = getOutputMimeTypeLiteral(context);
        if( result == null ) {
            String informalFormatName = getOutputInformalFormatNameLiteral(context);
            if( informalFormatName == null ) {
                informalFormatName = getOutputFileExtensionLiteral(context);
            }
            if( informalFormatName != null ) {
                if( expectedMimeClass != null && expectedMimeClass.equals(MIME_TYPE_CLASS_IMAGE) && informalFormatName.equalsIgnoreCase("jpg") ) {
                    // stupid special case (expect more)
                    informalFormatName = "jpeg";
                }
                result = expectedMimeClass+"/"+informalFormatName;
            } else {
                result = null;
            }
        }
        return result;
    }

    private static final String getOutputMimeTypeLiteral(AssetContext context) {
        return AssetContextHelper.getString(context, IAssetLabConstants.KEY_OUTPUT_TYPE_MIME);
    }

    public static final String getOutputInformalFormatName(AssetContext context) {
        String result = getOutputInformalFormatNameLiteral(context);
        if( result == null ) {
            String mimeType = getOutputMimeTypeLiteral(context);
            if( mimeType != null ) {
                int slashIndex = mimeType.indexOf('/');
                if( slashIndex >= 0 ) {
                    result = mimeType.substring(slashIndex+1);
                } else {
                    result = mimeType;
                }
            } else {
                result = getOutputFileExtensionLiteral(context);
            }
        }
        return result;
    }

    private static final String getOutputInformalFormatNameLiteral(AssetContext context) {
        return AssetContextHelper.getString(context, IAssetLabConstants.KEY_OUTPUT_TYPE_INFORMAL);
    }

    public static final String getOutputFileExtension(AssetContext context) {
        String fileExtension = getOutputFileExtensionLiteral(context);
        if( fileExtension == null ) {
            fileExtension = getOutputInformalFormatName(context);
        }
        return fileExtension;
    }

    private static final String getOutputFileExtensionLiteral(AssetContext context) {
        return AssetContextHelper.getString(context, IAssetLabConstants.KEY_OUTPUT_EXTENSION);
    }

    public static final String getOutputName(AssetContext context) {
        String filename = AssetContextHelper.getString(context, IAssetLabConstants.KEY_OUTPUT_NAME);
        if( filename == null ) {
            filename = AssetContextHelper.getString(context, IAssetLabConstants.KEY_SEQUENCE_NUMBER);
        }
        return filename;
    }

    public static final String getOutputFileName(AssetContext context) {
        String name = getOutputName(context);
        String extension = getOutputFileExtension(context);
        String filename;
        if( name != null ) {
            filename = name;
            if( extension != null ) {
                filename += "." + extension;
            }
        } else {
            filename = extension;
        }
        return filename;
    }
}
