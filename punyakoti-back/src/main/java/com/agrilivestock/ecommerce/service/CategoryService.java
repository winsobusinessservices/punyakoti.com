package com.agrilivestock.ecommerce.service;

import com.agrilivestock.ecommerce.dto.catalog.CategoryDto;
import java.util.List;

public interface CategoryService {
    List<CategoryDto> getAllCategories();
    CategoryDto getCategoryById(Long id);
    CategoryDto createCategory(CategoryDto dto);
    CategoryDto updateCategory(Long id, CategoryDto dto);
    void deleteCategory(Long id);
}
