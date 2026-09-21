package com.agrilivestock.ecommerce.dto.order;

import java.math.BigDecimal;

public record OrderItemResponse(
        Long id,
        String productName,
        String variantWeight,
        BigDecimal price,
        Integer quantity,
        BigDecimal lineTotal
) {}
