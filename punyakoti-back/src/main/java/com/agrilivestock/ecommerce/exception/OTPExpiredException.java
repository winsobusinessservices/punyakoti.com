package com.agrilivestock.ecommerce.exception;

/**
 * Thrown when an OTP has expired or exceeded its allowed verification attempts.
 */
public class OTPExpiredException extends RuntimeException {

    public OTPExpiredException(String message) {
        super(message);
    }
}
