package com.agrilivestock.ecommerce.dto.auth;

import jakarta.validation.constraints.NotBlank;

public record GoogleLoginRequest(
        @NotBlank(message = "Google token is required")
        String token
) {}
