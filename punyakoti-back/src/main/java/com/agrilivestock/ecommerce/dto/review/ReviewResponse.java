package com.agrilivestock.ecommerce.dto.review;

import java.time.Instant;

public record ReviewResponse(
        Long id,
        Long productId,
        String userName,
        String userMobile,
        Integer rating,
        String comment,
        String videoUrl,
        boolean approved,
        Instant createdAt
) {}
