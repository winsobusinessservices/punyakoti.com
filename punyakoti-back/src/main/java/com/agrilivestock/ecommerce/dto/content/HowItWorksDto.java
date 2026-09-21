package com.agrilivestock.ecommerce.dto.content;

import jakarta.validation.constraints.NotBlank;

public record HowItWorksDto(
        Long id,

        @NotBlank(message = "Title is required")
        String title,

        @NotBlank(message = "Description is required")
        String description,

        String videoUrl
) {}
