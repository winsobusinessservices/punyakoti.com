package com.agrilivestock.ecommerce.dto.catalog;

import java.time.Instant;
import java.util.List;

public record ProductDto(
        Long id,
        String name,
        String shortDescription,
        String description,
        String benefits,
        String ingredients,
        String usageInstructions,
        CategoryDto category,
        boolean active,
        List<ProductVariantDto> variants,
        List<ProductMediaDto> media,
        Double averageRating,
        Integer reviewCount,
        Instant createdAt
) {}
