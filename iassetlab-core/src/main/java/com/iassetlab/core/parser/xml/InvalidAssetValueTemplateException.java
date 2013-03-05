package com.iassetlab.core.parser.xml;

/**
 * Created with IntelliJ IDEA.
 * User: chris
 * Date: 5/03/13
 * Time: 12:54 PM
 * To change this template use File | Settings | File Templates.
 */
public class InvalidAssetValueTemplateException extends Exception {
    public InvalidAssetValueTemplateException(String message) {
        super(message);
    }

    public InvalidAssetValueTemplateException(String message, Throwable cause) {
        super(message, cause);
    }

    public InvalidAssetValueTemplateException(Throwable cause) {
        super(cause);
    }
}
