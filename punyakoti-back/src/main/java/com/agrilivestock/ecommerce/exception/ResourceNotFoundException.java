package com.agrilivestock.ecommerce.exception;

/**
 * Thrown when a requested entity cannot be located.
 */
public class ResourceNotFoundException extends RuntimeException {

    public ResourceNotFoundException(String message) {
        super(message);
    }

    public ResourceNotFoundException(String resource, Object id) {
        super("%s not found with identifier: %s".formatted(resource, id));
    }
}
