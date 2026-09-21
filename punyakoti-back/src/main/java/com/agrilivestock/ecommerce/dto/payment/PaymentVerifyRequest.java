package com.agrilivestock.ecommerce.dto.payment;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record PaymentVerifyRequest(
        @NotNull(message = "Local Order ID is required")
        Long localOrderId,
        @NotBlank(message = "Razorpay Order ID is required")
        String razorpayOrderId,
        @NotBlank(message = "Razorpay Payment ID is required")
        String razorpayPaymentId,
        @NotBlank(message = "Razorpay Signature is required")
        String razorpaySignature
) {}
