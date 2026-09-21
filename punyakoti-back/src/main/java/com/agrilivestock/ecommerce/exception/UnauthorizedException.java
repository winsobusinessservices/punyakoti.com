package com.agrilivestock.ecommerce.exception;

/**
 * Thrown when authentication is missing or invalid.
 */
public class UnauthorizedException extends RuntimeException {

    public UnauthorizedException(String message) {
        super(message);
    }
}
