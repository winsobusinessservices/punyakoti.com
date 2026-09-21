package com.agrilivestock.ecommerce.service.impl;

import com.agrilivestock.ecommerce.dto.catalog.CategoryDto;
import com.agrilivestock.ecommerce.entity.Category;
import com.agrilivestock.ecommerce.exception.ResourceNotFoundException;
import com.agrilivestock.ecommerce.mapper.CategoryMapper;
import com.agrilivestock.ecommerce.repository.CategoryRepository;
import com.agrilivestock.ecommerce.service.CategoryService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class CategoryServiceImpl implements CategoryService {

    private final CategoryRepository categoryRepository;
    private final CategoryMapper categoryMapper;

    @Override
    public List<CategoryDto> getAllCategories() {
        return categoryRepository.findAll().stream()
                .map(categoryMapper::toDto)
                .toList();
    }

    @Override
    public CategoryDto getCategoryById(Long id) {
        Category category = categoryRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Category not found with id: " + id));
        return categoryMapper.toDto(category);
    }

    @Override
    @Transactional
    public CategoryDto createCategory(CategoryDto dto) {
        Category category = categoryMapper.toEntity(dto);
        Category saved = categoryRepository.save(category);
        return categoryMapper.toDto(saved);
    }

    @Override
    @Transactional
    public CategoryDto updateCategory(Long id, CategoryDto dto) {
        Category category = categoryRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Category not found with id: " + id));
        category.setName(dto.name());
        category.setDescription(dto.description());
        category.setImage(dto.image());
        return categoryMapper.toDto(categoryRepository.save(category));
    }

    @Override
    @Transactional
    public void deleteCategory(Long id) {
        if (!categoryRepository.existsById(id)) {
            throw new ResourceNotFoundException("Category not found with id: " + id);
        }
        categoryRepository.deleteById(id);
    }
}
