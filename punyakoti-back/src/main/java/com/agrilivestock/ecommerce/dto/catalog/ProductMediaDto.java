package com.agrilivestock.ecommerce.dto.catalog;

import com.agrilivestock.ecommerce.enums.MediaType;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import com.fasterxml.jackson.annotation.JsonProperty;

public record ProductMediaDto(
        @JsonProperty("id")
        Long id,

        @JsonProperty("type")
        @NotNull(message = "Media type is required")
        MediaType type,

        @JsonProperty("url")
        @NotBlank(message = "URL is required")
        String url,

        @JsonProperty("displayOrder")
        Integer displayOrder,

        @JsonProperty("thumbnail")
        boolean thumbnail
) {}
