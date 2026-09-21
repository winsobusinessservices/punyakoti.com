package com.agrilivestock.ecommerce.response;

import com.fasterxml.jackson.annotation.JsonInclude;

import java.time.Instant;

/**
 * Standard envelope returned by every endpoint.
 *
 * @param success   whether the request succeeded
 * @param message   human readable message
 * @param data      payload (may be {@code null})
 * @param timestamp server time the response was produced
 */
@JsonInclude(JsonInclude.Include.ALWAYS)
public record ApiResponse<T>(boolean success, String message, T data, Instant timestamp) {

    public static <T> ApiResponse<T> success(String message, T data) {
        return new ApiResponse<>(true, message, data, Instant.now());
    }

    public static <T> ApiResponse<T> success(String message) {
        return new ApiResponse<>(true, message, null, Instant.now());
    }

    public static <T> ApiResponse<T> error(String message, T data) {
        return new ApiResponse<>(false, message, data, Instant.now());
    }

    public static <T> ApiResponse<T> error(String message) {
        return new ApiResponse<>(false, message, null, Instant.now());
    }
}
