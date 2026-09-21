package com.agrilivestock.ecommerce.controller;

import com.agrilivestock.ecommerce.dto.content.FAQDto;
import com.agrilivestock.ecommerce.response.ApiResponse;
import com.agrilivestock.ecommerce.service.FAQService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/v1/faqs")
@RequiredArgsConstructor
@Tag(name = "FAQ Content", description = "Public FAQ endpoints")
public class FAQController {

    private final FAQService faqService;

    @GetMapping
    @Operation(summary = "Get all FAQs")
    public ResponseEntity<ApiResponse<List<FAQDto>>> getAllFaqs() {
        List<FAQDto> faqs = faqService.getAllFaqs();
        return ResponseEntity.ok(ApiResponse.success("FAQs retrieved successfully", faqs));
    }
}
