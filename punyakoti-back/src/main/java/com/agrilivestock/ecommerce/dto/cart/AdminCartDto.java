package com.agrilivestock.ecommerce.dto.cart;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.List;

public record AdminCartDto(
        Long id,
        Long userId,
        String userName,
        String userEmail,
        String userPhone,
        List<CartItemDto> items,
        BigDecimal total,
        Instant lastUpdated
) {}
