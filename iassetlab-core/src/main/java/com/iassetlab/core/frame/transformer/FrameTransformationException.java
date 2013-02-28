package com.iassetlab.core.frame.transformer;

/**
 * Created with IntelliJ IDEA.
 * User: chris
 * Date: 28/02/13
 * Time: 10:12 AM
 * To change this template use File | Settings | File Templates.
 */
public class FrameTransformationException extends Exception {

    public FrameTransformationException() {

    }

    public FrameTransformationException(String message) {
        super(message);
    }

    public FrameTransformationException(Throwable cause) {
        super(cause);
    }

    public FrameTransformationException(String message, Throwable cause) {
        super(message, cause);
    }
}
