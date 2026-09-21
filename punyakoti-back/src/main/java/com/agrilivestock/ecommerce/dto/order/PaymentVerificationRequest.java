package com.agrilivestock.ecommerce.dto.order;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.validation.constraints.NotBlank;

public record PaymentVerificationRequest(
        @NotBlank(message = "Razorpay Order ID is required")
        @JsonProperty("razorpayOrderId")
        String razorpayOrderId,

        @NotBlank(message = "Razorpay Payment ID is required")
        @JsonProperty("razorpayPaymentId")
        String razorpayPaymentId,

        @NotBlank(message = "Razorpay Signature is required")
        @JsonProperty("razorpaySignature")
        String razorpaySignature
) {}
