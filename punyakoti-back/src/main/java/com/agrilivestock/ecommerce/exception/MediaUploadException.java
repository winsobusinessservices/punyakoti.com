package com.agrilivestock.ecommerce.exception;

/**
 * Thrown when a media asset cannot be uploaded or stored.
 */
public class MediaUploadException extends RuntimeException {

    public MediaUploadException(String message) {
        super(message);
    }

    public MediaUploadException(String message, Throwable cause) {
        super(message, cause);
    }
}
