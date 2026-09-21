package com.agrilivestock.ecommerce;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.context.properties.ConfigurationPropertiesScan;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;

/**
 * Entry point for the agriculture/livestock e-commerce backend.
 *
 * <p>JPA auditing is enabled here so that {@code createdAt}, {@code updatedAt},
 * {@code createdBy} and {@code updatedBy} fields are populated automatically.</p>
 */
@SpringBootApplication
@ConfigurationPropertiesScan
@EnableJpaAuditing(auditorAwareRef = "auditorAware")
public class EcommerceBackendApplication {

    public static void main(String[] args) {
        SpringApplication.run(EcommerceBackendApplication.class, args);
    }
}
