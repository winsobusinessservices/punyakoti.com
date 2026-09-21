package com.agrilivestock.ecommerce.dto.cart;

import com.agrilivestock.ecommerce.dto.catalog.ProductDto;
import com.agrilivestock.ecommerce.dto.catalog.ProductVariantDto;

public record CartItemDto(
        Long id,
        ProductDto product,
        ProductVariantDto variant,
        Integer quantity
) {}
