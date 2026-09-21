package com.agrilivestock.ecommerce.dto.catalog;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

import com.fasterxml.jackson.annotation.JsonProperty;

public record CategoryDto(
        @JsonProperty("id")
        Long id,

        @JsonProperty("name")
        @NotBlank(message = "Category name is required")
        @Size(max = 100, message = "Name must not exceed 100 characters")
        String name,

        @JsonProperty("description")
        String description,

        @JsonProperty("image")
        String image
) {}
