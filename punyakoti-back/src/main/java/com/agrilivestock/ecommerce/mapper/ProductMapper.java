package com.agrilivestock.ecommerce.mapper;

import com.agrilivestock.ecommerce.dto.catalog.ProductDto;
import com.agrilivestock.ecommerce.dto.catalog.ProductMediaDto;
import com.agrilivestock.ecommerce.dto.catalog.ProductVariantDto;
import com.agrilivestock.ecommerce.entity.Product;
import com.agrilivestock.ecommerce.entity.ProductMedia;
import com.agrilivestock.ecommerce.entity.ProductVariant;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring", uses = {CategoryMapper.class})
public interface ProductMapper {

    @org.mapstruct.Mapping(target = "averageRating", expression = "java(5.0)")
    @org.mapstruct.Mapping(target = "reviewCount", expression = "java(12)")
    ProductDto toDto(Product product);
    ProductVariantDto toVariantDto(ProductVariant variant);
    ProductMediaDto toMediaDto(ProductMedia media);

    ProductVariant toVariantEntity(ProductVariantDto dto);
    ProductMedia toMediaEntity(ProductMediaDto dto);
}
