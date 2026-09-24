package com.agrilivestock.ecommerce.dto.user;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record AddressDto(
        Long id,

        @NotBlank(message = "Address line 1 is required")
        @Size(max = 255, message = "Line 1 must not exceed 255 characters")
        String line1,

        String line2,

        @NotBlank(message = "City is required")
        @Size(max = 100, message = "City must not exceed 100 characters")
        String city,

        @NotBlank(message = "State is required")
        @Size(max = 100, message = "State must not exceed 100 characters")
        String state,

        @NotBlank(message = "Postal code is required")
        @Size(max = 20, message = "Postal code must not exceed 20 characters")
        String postalCode,

        String country,

        boolean isDefault
) {}
