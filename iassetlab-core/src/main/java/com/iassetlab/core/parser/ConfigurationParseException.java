package com.iassetlab.core.parser;

/**
 * Created with IntelliJ IDEA.
 * User: chris
 * Date: 25/02/13
 * Time: 3:29 PM
 * To change this template use File | Settings | File Templates.
 */
public class ConfigurationParseException extends Exception {
    public ConfigurationParseException(String message) {
        super(message);
    }

    public ConfigurationParseException(String message, Throwable cause) {
        super(message, cause);
    }

    public ConfigurationParseException(Throwable cause) {
        super(cause);
    }
}
