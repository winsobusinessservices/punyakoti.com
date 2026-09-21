package com.agrilivestock.ecommerce.controller;

import com.agrilivestock.ecommerce.dto.catalog.ProductDto;
import com.agrilivestock.ecommerce.response.ApiResponse;
import com.agrilivestock.ecommerce.response.PageResponse;
import com.agrilivestock.ecommerce.service.ProductService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.math.BigDecimal;
import java.util.List;

@RestController
@RequestMapping("/api/v1/products")
@RequiredArgsConstructor
@Tag(name = "Product Catalog", description = "Public product browsing, search, and details APIs")
public class ProductController {

    private final ProductService productService;

    @GetMapping
    @Operation(summary = "Filter, search, and page products")
    public ResponseEntity<ApiResponse<PageResponse<ProductDto>>> getProducts(
            @RequestParam(required = false) String search,
            @RequestParam(required = false) Long categoryId,
            @RequestParam(required = false) BigDecimal minPrice,
            @RequestParam(required = false) BigDecimal maxPrice,
            @RequestParam(required = false) String weight,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "id,desc") String[] sort
    ) {
        Sort.Direction direction = sort.length > 1 && sort[1].equalsIgnoreCase("asc") ? Sort.Direction.ASC : Sort.Direction.DESC;
        Pageable pageable = PageRequest.of(page, size, Sort.by(direction, sort[0]));

        PageResponse<ProductDto> result = productService.getProducts(search, categoryId, minPrice, maxPrice, weight, pageable);
        return ResponseEntity.ok(ApiResponse.success("Products retrieved successfully", result));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get product by ID")
    public ResponseEntity<ApiResponse<ProductDto>> getProductById(@PathVariable Long id) {
        ProductDto product = productService.getProductById(id);
        return ResponseEntity.ok(ApiResponse.success("Product retrieved successfully", product));
    }

    @GetMapping("/category/{categoryId}")
    @Operation(summary = "Get active products by Category ID")
    public ResponseEntity<ApiResponse<List<ProductDto>>> getProductsByCategory(@PathVariable Long categoryId) {
        List<ProductDto> products = productService.getProductsByCategory(categoryId);
        return ResponseEntity.ok(ApiResponse.success("Category products retrieved successfully", products));
    }
}
