package com.agrilivestock.ecommerce.dto.order;

import com.agrilivestock.ecommerce.dto.user.AddressDto;
import com.agrilivestock.ecommerce.enums.OrderStatus;
import java.math.BigDecimal;
import java.time.Instant;
import java.util.List;

public record OrderResponse(
        Long id,
        String orderNumber,
        OrderStatus status,
        BigDecimal total,
        Instant createdAt,
        AddressDto address,
        List<OrderItemResponse> items,
        String razorpayOrderId,
        String paymentId,
        String paymentStatus
) {}
