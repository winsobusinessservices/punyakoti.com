package com.agrilivestock.ecommerce.mapper;

import com.agrilivestock.ecommerce.dto.catalog.CategoryDto;
import com.agrilivestock.ecommerce.entity.Category;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface CategoryMapper {
    CategoryDto toDto(Category category);
    Category toEntity(CategoryDto dto);
}
