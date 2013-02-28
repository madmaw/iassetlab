package com.iassetlab.core.frame;

/**
 * Created with IntelliJ IDEA.
 * User: chris
 * Date: 28/02/13
 * Time: 10:09 AM
 * To change this template use File | Settings | File Templates.
 */
public class FrameGenerationException extends Exception {

    public FrameGenerationException() {

    }

    public FrameGenerationException(String message ) {
        super(message);
    }

    public FrameGenerationException(Throwable cause) {
        super(cause);
    }

    public FrameGenerationException(String message, Throwable cause) {
        super(message, cause);
    }

}
