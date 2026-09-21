package com.agrilivestock.ecommerce.dto.content;

import jakarta.validation.constraints.NotBlank;

public record BannerDto(
        Long id,

        String imageUrl,

        @NotBlank(message = "Title is required")
        String title,

        String subtitle,
        String buttonText,
        String buttonUrl
) {}
