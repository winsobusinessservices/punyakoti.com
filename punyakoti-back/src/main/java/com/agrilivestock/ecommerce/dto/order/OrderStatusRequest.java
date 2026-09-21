package com.agrilivestock.ecommerce.dto.order;

import com.agrilivestock.ecommerce.enums.OrderStatus;
import jakarta.validation.constraints.NotNull;

public record OrderStatusRequest(
        @NotNull(message = "Order status is required")
        OrderStatus status
) {}
