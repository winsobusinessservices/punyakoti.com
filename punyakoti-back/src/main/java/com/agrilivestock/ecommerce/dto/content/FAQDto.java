package com.agrilivestock.ecommerce.dto.content;

import jakarta.validation.constraints.NotBlank;

public record FAQDto(
        Long id,

        @NotBlank(message = "Question is required")
        String question,

        @NotBlank(message = "Answer is required")
        String answer
) {}
