package com.iassetlab.core.frame;

/**
 * Created with IntelliJ IDEA.
 * User: chris
 * Date: 4/03/13
 * Time: 3:12 PM
 * To change this template use File | Settings | File Templates.
 */
public class FrameConsumptionException extends Exception {
    public FrameConsumptionException() {

    }

    public FrameConsumptionException(String message) {
        super(message);
    }

    public FrameConsumptionException(String message, Throwable cause) {
        super(message, cause);
    }

    public FrameConsumptionException(Throwable cause) {
        super(cause);
    }
}
