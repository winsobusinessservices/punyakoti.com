package com.agrilivestock.ecommerce.dto.cart;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

public record CartAddRequest(
        @NotNull(message = "Product ID is required")
        Long productId,

        @NotNull(message = "Variant ID is required")
        Long variantId,

        @NotNull(message = "Quantity is required")
        @Positive(message = "Quantity must be positive")
        Integer quantity
) {}
