package com.agrilivestock.ecommerce.service;

import com.agrilivestock.ecommerce.dto.catalog.ProductDto;
import com.agrilivestock.ecommerce.dto.catalog.ProductRequest;
import com.agrilivestock.ecommerce.response.PageResponse;
import org.springframework.data.domain.Pageable;

import java.math.BigDecimal;
import java.util.List;

public interface ProductService {
    PageResponse<ProductDto> getProducts(String search, Long categoryId, BigDecimal minPrice, BigDecimal maxPrice, String weight, Pageable pageable);
    PageResponse<ProductDto> getAllProductsAdmin(String search, Long categoryId, BigDecimal minPrice, BigDecimal maxPrice, String weight, Pageable pageable);
    List<ProductDto> getProductsByCategory(Long categoryId);
    ProductDto getProductById(Long id);
    ProductDto createProduct(ProductRequest request);
    ProductDto updateProduct(Long id, ProductRequest request);
    void deleteProduct(Long id);
}
