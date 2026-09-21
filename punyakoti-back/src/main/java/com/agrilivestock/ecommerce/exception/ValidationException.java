package com.agrilivestock.ecommerce.exception;

/**
 * Thrown for programmatic (non-annotation) validation failures.
 */
public class ValidationException extends RuntimeException {

    public ValidationException(String message) {
        super(message);
    }
}
