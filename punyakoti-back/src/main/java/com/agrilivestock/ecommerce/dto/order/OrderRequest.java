package com.agrilivestock.ecommerce.dto.order;

import jakarta.validation.constraints.NotNull;

public record OrderRequest(
        @NotNull(message = "Address ID is required")
        Long addressId,
        String paymentMethod
) {}
