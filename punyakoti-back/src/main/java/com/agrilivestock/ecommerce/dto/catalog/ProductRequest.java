package com.agrilivestock.ecommerce.dto.catalog;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonProperty;

public record ProductRequest(
        @JsonProperty("name")
        @NotBlank(message = "Product name is required")
        @Size(max = 150, message = "Name must not exceed 150 characters")
        String name,

        @JsonProperty("shortDescription")
        @Size(max = 300, message = "Short description must not exceed 300 characters")
        String shortDescription,

        @JsonProperty("description")
        String description,
        
        @JsonProperty("benefits")
        String benefits,
        
        @JsonProperty("ingredients")
        String ingredients,
        
        @JsonProperty("usageInstructions")
        String usageInstructions,

        @JsonProperty("categoryId")
        @NotNull(message = "Category ID is required")
        Long categoryId,

        @JsonProperty("active")
        boolean active,

        @JsonProperty("variants")
        @NotEmpty(message = "At least one variant is required")
        @Valid
        List<ProductVariantDto> variants,

        @JsonProperty("media")
        @Valid
        List<ProductMediaDto> media
) {}
