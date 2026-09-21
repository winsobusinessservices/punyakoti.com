package com.agrilivestock.ecommerce.dto.catalog;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.PositiveOrZero;
import java.math.BigDecimal;

import com.fasterxml.jackson.annotation.JsonProperty;

public record ProductVariantDto(
        @JsonProperty("id")
        Long id,

        @JsonProperty("weight")
        @NotBlank(message = "Weight is required")
        String weight,

        @JsonProperty("price")
        @NotNull(message = "Price is required")
        @Positive(message = "Price must be positive")
        BigDecimal price,

        @JsonProperty("stock")
        @NotNull(message = "Stock is required")
        @PositiveOrZero(message = "Stock cannot be negative")
        Integer stock,

        @JsonProperty("sku")
        String sku
) {}
