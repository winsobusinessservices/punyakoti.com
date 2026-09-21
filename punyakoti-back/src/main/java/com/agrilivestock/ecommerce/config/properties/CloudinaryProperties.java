package com.agrilivestock.ecommerce.config.properties;

import org.springframework.boot.context.properties.ConfigurationProperties;

/**
 * Binding for Cloudinary credentials. Only used when {@code app.media.provider=cloudinary}.
 */
@ConfigurationProperties(prefix = "cloudinary")
public record CloudinaryProperties(String cloudName, String apiKey, String apiSecret) {
}
