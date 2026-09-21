package com.agrilivestock.ecommerce.dto.user;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record UserProfileRequest(
        @NotBlank(message = "Name is required")
        @Size(max = 120, message = "Name must not exceed 120 characters")
        String name,

        @Size(max = 20, message = "Preferred language must not exceed 20 characters")
        String preferredLanguage,

        @Size(max = 15, message = "Mobile number must not exceed 15 characters")
        String mobileNumber
) {}
