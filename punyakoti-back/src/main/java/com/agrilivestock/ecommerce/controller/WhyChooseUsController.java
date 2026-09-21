package com.agrilivestock.ecommerce.controller;

import com.agrilivestock.ecommerce.dto.content.WhyChooseUsDto;
import com.agrilivestock.ecommerce.response.ApiResponse;
import com.agrilivestock.ecommerce.service.WhyChooseUsService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/v1/why-choose-us")
@RequiredArgsConstructor
@Tag(name = "Why Choose Us Content", description = "Public Why Choose Us endpoints")
public class WhyChooseUsController {

    private final WhyChooseUsService service;

    @GetMapping
    @Operation(summary = "Get all Why Choose Us items")
    public ResponseEntity<ApiResponse<List<WhyChooseUsDto>>> getAll() {
        List<WhyChooseUsDto> list = service.getAll();
        return ResponseEntity.ok(ApiResponse.success("Why Choose Us items retrieved successfully", list));
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Create a new Why Choose Us item")
    public ResponseEntity<ApiResponse<WhyChooseUsDto>> create(@Valid @RequestBody WhyChooseUsDto dto) {
        WhyChooseUsDto created = service.create(dto);
        return ResponseEntity.ok(ApiResponse.success("Why Choose Us item created successfully", created));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Update an existing Why Choose Us item")
    public ResponseEntity<ApiResponse<WhyChooseUsDto>> update(@PathVariable Long id, @Valid @RequestBody WhyChooseUsDto dto) {
        WhyChooseUsDto updated = service.update(id, dto);
        return ResponseEntity.ok(ApiResponse.success("Why Choose Us item updated successfully", updated));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Delete a Why Choose Us item")
    public ResponseEntity<ApiResponse<Void>> delete(@PathVariable Long id) {
        service.delete(id);
        return ResponseEntity.ok(ApiResponse.success("Why Choose Us item deleted successfully"));
    }

}
