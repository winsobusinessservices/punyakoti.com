package com.agrilivestock.ecommerce.repository;

import com.agrilivestock.ecommerce.entity.Product;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.lang.NonNull;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ProductRepository extends JpaRepository<Product, Long>, JpaSpecificationExecutor<Product> {

    @EntityGraph(attributePaths = {"category", "variants", "media"})
    Optional<Product> findWithDetailsById(Long id);

    @EntityGraph(attributePaths = {"category", "variants", "media"})
    Page<Product> findByActiveTrue(Pageable pageable);

    @EntityGraph(attributePaths = {"category", "variants", "media"})
    Page<Product> findByCategoryIdAndActiveTrue(Long categoryId, Pageable pageable);

    @EntityGraph(attributePaths = {"category", "variants", "media"})
    List<Product> findByCategoryIdAndActiveTrue(Long categoryId);

    @Override
    @EntityGraph(attributePaths = {"category", "variants", "media"})
    @NonNull
    Page<Product> findAll(Specification<Product> spec, @NonNull Pageable pageable);

    long countByActiveTrue();
}
