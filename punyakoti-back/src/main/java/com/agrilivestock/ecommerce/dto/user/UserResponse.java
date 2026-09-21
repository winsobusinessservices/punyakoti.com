package com.agrilivestock.ecommerce.dto.user;

import java.time.Instant;

public record UserResponse(
        Long id,
        String name,
        String email,
        String mobileNumber,
        String preferredLanguage,
        String role,
        boolean enabled,
        Instant lastLogin,
        Instant createdAt
) {}
