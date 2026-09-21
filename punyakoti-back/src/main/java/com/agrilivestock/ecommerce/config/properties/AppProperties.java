package com.agrilivestock.ecommerce.config.properties;

import org.springframework.boot.context.properties.ConfigurationProperties;

import java.util.List;

/**
 * Strongly typed binding for all {@code app.*} configuration values.
 */
@ConfigurationProperties(prefix = "app")
public record AppProperties(Jwt jwt, Otp otp, Media media, Cors cors, Razorpay razorpay) {

    public record Jwt(String secret, long expirationMs, long refreshExpirationMs, String issuer) {
    }

    public record Otp(int length, long expirySeconds, int maxAttempts, String provider) {
    }

    public record Media(String provider, Local local) {
        public record Local(String basePath, String publicUrl) {
        }
    }

    public record Cors(List<String> allowedOrigins) {
    }

    public record Razorpay(String keyId, String keySecret) {
    }
}
