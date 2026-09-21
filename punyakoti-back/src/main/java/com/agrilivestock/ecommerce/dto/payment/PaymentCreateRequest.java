package com.agrilivestock.ecommerce.dto.payment;

import jakarta.validation.constraints.NotNull;

public record PaymentCreateRequest(
        @NotNull(message = "Address ID is required")
        Long addressId
) {}
