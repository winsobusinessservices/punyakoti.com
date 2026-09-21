package com.agrilivestock.ecommerce.controller;

import com.agrilivestock.ecommerce.dto.content.BannerDto;
import com.agrilivestock.ecommerce.response.ApiResponse;
import com.agrilivestock.ecommerce.service.BannerService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/v1/banners")
@RequiredArgsConstructor
@Tag(name = "Banners", description = "Public homepage marketing banner endpoints")
public class BannerController {

    private final BannerService bannerService;

    @GetMapping
    @Operation(summary = "Get all active homepage banners")
    public ResponseEntity<ApiResponse<List<BannerDto>>> getAllBanners() {
        List<BannerDto> banners = bannerService.getAllBanners();
        return ResponseEntity.ok(ApiResponse.success("Banners retrieved successfully", banners));
    }
}
