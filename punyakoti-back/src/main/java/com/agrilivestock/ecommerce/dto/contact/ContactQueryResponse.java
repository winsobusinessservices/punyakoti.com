package com.agrilivestock.ecommerce.dto.contact;

import java.time.Instant;

public record ContactQueryResponse(
        Long id,
        String name,
        String email,
        String phone,
        String subject,
        String message,
        boolean resolved,
        Instant createdAt
) {}
