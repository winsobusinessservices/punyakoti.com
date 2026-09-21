package com.agrilivestock.ecommerce.config;

import com.agrilivestock.ecommerce.security.CustomUserDetails;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.domain.AuditorAware;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;

import java.util.Optional;

/**
 * Supplies the current auditor (authenticated user id) for JPA auditing so that
 * {@code createdBy} and {@code updatedBy} fields are populated automatically.
 */
@Configuration
public class AuditingConfig {

    @Bean
    public AuditorAware<String> auditorAware() {
        return new SecurityAuditorAware();
    }

    /**
     * Resolves the current principal into an auditor identifier.
     */
    static class SecurityAuditorAware implements AuditorAware<String> {

        private static final String SYSTEM = "SYSTEM";

        @Override
        public Optional<String> getCurrentAuditor() {
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            if (authentication == null || !authentication.isAuthenticated()
                    || authentication instanceof org.springframework.security.authentication.AnonymousAuthenticationToken) {
                return Optional.of(SYSTEM);
            }
            Object principal = authentication.getPrincipal();
            if (principal instanceof CustomUserDetails userDetails) {
                return Optional.of(String.valueOf(userDetails.getId()));
            }
            return Optional.of(SYSTEM);
        }
    }
}
