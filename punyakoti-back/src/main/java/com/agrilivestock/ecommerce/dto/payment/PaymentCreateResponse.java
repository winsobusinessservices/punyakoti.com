package com.agrilivestock.ecommerce.dto.payment;

public record PaymentCreateResponse(
        String razorpayOrderId,
        String currency,
        Long amount,
        Long localOrderId
) {}
