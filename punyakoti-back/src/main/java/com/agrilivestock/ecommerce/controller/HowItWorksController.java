package com.agrilivestock.ecommerce.controller;

import com.agrilivestock.ecommerce.dto.content.HowItWorksDto;
import com.agrilivestock.ecommerce.response.ApiResponse;
import com.agrilivestock.ecommerce.service.HowItWorksService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/v1/how-it-works")
@RequiredArgsConstructor
@Tag(name = "How It Works Content", description = "Public How It Works video/step endpoints")
public class HowItWorksController {

    private final HowItWorksService service;

    @GetMapping
    @Operation(summary = "Get all How It Works steps")
    public ResponseEntity<ApiResponse<List<HowItWorksDto>>> getAll() {
        List<HowItWorksDto> list = service.getAll();
        return ResponseEntity.ok(ApiResponse.success("How It Works steps retrieved successfully", list));
    }
}
