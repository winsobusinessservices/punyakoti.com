package com.agrilivestock.ecommerce.service.impl;

import com.agrilivestock.ecommerce.dto.catalog.ProductDto;
import com.agrilivestock.ecommerce.dto.catalog.ProductRequest;
import com.agrilivestock.ecommerce.entity.Category;
import com.agrilivestock.ecommerce.entity.Product;
import com.agrilivestock.ecommerce.entity.ProductMedia;
import com.agrilivestock.ecommerce.entity.ProductVariant;
import com.agrilivestock.ecommerce.exception.ResourceNotFoundException;
import com.agrilivestock.ecommerce.mapper.ProductMapper;
import com.agrilivestock.ecommerce.repository.CategoryRepository;
import com.agrilivestock.ecommerce.repository.ProductRepository;
import com.agrilivestock.ecommerce.response.PageResponse;
import com.agrilivestock.ecommerce.service.ProductService;
import com.agrilivestock.ecommerce.specification.ProductSpecification;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class ProductServiceImpl implements ProductService {

    private final ProductRepository productRepository;
    private final CategoryRepository categoryRepository;
    private final ProductMapper productMapper;

    @Override
    public PageResponse<ProductDto> getProducts(
            String search,
            Long categoryId,
            BigDecimal minPrice,
            BigDecimal maxPrice,
            String weight,
            Pageable pageable
    ) {
        Specification<Product> spec = ProductSpecification.filterProducts(search, categoryId, minPrice, maxPrice, weight, true);
        Page<Product> page = productRepository.findAll(spec, pageable);
        List<ProductDto> content = page.getContent().stream().map(productMapper::toDto).toList();
        return PageResponse.of(page, content);
    }

    @Override
    public PageResponse<ProductDto> getAllProductsAdmin(
            String search,
            Long categoryId,
            BigDecimal minPrice,
            BigDecimal maxPrice,
            String weight,
            Pageable pageable
    ) {
        Specification<Product> spec = ProductSpecification.filterProducts(search, categoryId, minPrice, maxPrice, weight, false);
        Page<Product> page = productRepository.findAll(spec, pageable);
        List<ProductDto> content = page.getContent().stream().map(productMapper::toDto).toList();
        return PageResponse.of(page, content);
    }

    @Override
    public List<ProductDto> getProductsByCategory(Long categoryId) {
        return productRepository.findByCategoryIdAndActiveTrue(categoryId).stream()
                .map(productMapper::toDto)
                .toList();
    }

    @Override
    public ProductDto getProductById(Long id) {
        Product product = productRepository.findWithDetailsById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found with id: " + id));
        return productMapper.toDto(product);
    }

    @Override
    @Transactional
    public ProductDto createProduct(ProductRequest request) {
        Category category = categoryRepository.findById(request.categoryId())
                .orElseThrow(() -> new ResourceNotFoundException("Category not found with id: " + request.categoryId()));

        Product product = Product.builder()
                .name(request.name())
                .shortDescription(request.shortDescription())
                .description(request.description())
                .benefits(request.benefits())
                .ingredients(request.ingredients())
                .usageInstructions(request.usageInstructions())
                .category(category)
                .active(request.active())
                .build();

        if (request.variants() != null) {
            List<ProductVariant> variants = request.variants().stream().map(vDto -> {
                ProductVariant variant = productMapper.toVariantEntity(vDto);
                variant.setProduct(product);
                return variant;
            }).toList();
            product.getVariants().addAll(variants);
        }

        if (request.media() != null) {
            List<ProductMedia> mediaList = request.media().stream().map(mDto -> {
                ProductMedia media = productMapper.toMediaEntity(mDto);
                media.setProduct(product);
                return media;
            }).toList();
            product.getMedia().addAll(mediaList);
        }

        Product saved = productRepository.save(product);
        return productMapper.toDto(saved);
    }

    @Override
    @Transactional
    public ProductDto updateProduct(Long id, ProductRequest request) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found with id: " + id));

        Category category = categoryRepository.findById(request.categoryId())
                .orElseThrow(() -> new ResourceNotFoundException("Category not found with id: " + request.categoryId()));

        product.setName(request.name());
        product.setShortDescription(request.shortDescription());
        product.setDescription(request.description());
        product.setBenefits(request.benefits());
        product.setIngredients(request.ingredients());
        product.setUsageInstructions(request.usageInstructions());
        product.setCategory(category);
        product.setActive(request.active());

        if (request.variants() != null) {
            java.util.Map<String, com.agrilivestock.ecommerce.dto.catalog.ProductVariantDto> reqVariants = request.variants().stream()
                    .collect(Collectors.toMap(
                            v -> v.weight().toLowerCase().trim(),
                            v -> v,
                            (v1, v2) -> v1
                    ));

            product.getVariants().removeIf(v -> v.getWeight() == null || !reqVariants.containsKey(v.getWeight().toLowerCase().trim()));

            request.variants().forEach(vDto -> {
                String weightKey = vDto.weight().toLowerCase().trim();
                ProductVariant existing = product.getVariants().stream()
                        .filter(v -> v.getWeight() != null && v.getWeight().toLowerCase().trim().equals(weightKey))
                        .findFirst()
                        .orElse(null);

                if (existing != null) {
                    existing.setPrice(vDto.price());
                    existing.setStock(vDto.stock());
                    existing.setSku(vDto.sku());
                } else {
                    ProductVariant variant = productMapper.toVariantEntity(vDto);
                    variant.setProduct(product);
                    product.getVariants().add(variant);
                }
            });
        }

        if (request.media() != null) {
            java.util.Map<String, com.agrilivestock.ecommerce.dto.catalog.ProductMediaDto> reqMedia = request.media().stream()
                    .collect(Collectors.toMap(
                            m -> m.url().toLowerCase().trim(),
                            m -> m,
                            (m1, m2) -> m1
                    ));

            product.getMedia().removeIf(m -> m.getUrl() == null || !reqMedia.containsKey(m.getUrl().toLowerCase().trim()));

            request.media().forEach(mDto -> {
                String urlKey = mDto.url().toLowerCase().trim();
                ProductMedia existing = product.getMedia().stream()
                        .filter(m -> m.getUrl() != null && m.getUrl().toLowerCase().trim().equals(urlKey))
                        .findFirst()
                        .orElse(null);

                if (existing != null) {
                    existing.setType(mDto.type());
                    existing.setDisplayOrder(mDto.displayOrder());
                    existing.setThumbnail(String.valueOf(mDto.thumbnail()));
                } else {
                    ProductMedia media = productMapper.toMediaEntity(mDto);
                    media.setProduct(product);
                    product.getMedia().add(media);
                }
            });
        }

        return productMapper.toDto(productRepository.save(product));
    }

    @Override
    @Transactional
    public void deleteProduct(Long id) {
        if (!productRepository.existsById(id)) {
            throw new ResourceNotFoundException("Product not found with id: " + id);
        }
        productRepository.deleteById(id);
    }
}
