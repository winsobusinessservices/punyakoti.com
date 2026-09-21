package com.agrilivestock.ecommerce.exception;

/**
 * Thrown when the client supplies a semantically invalid request.
 */
public class BadRequestException extends RuntimeException {

    public BadRequestException(String message) {
        super(message);
    }
}
