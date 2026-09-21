package com.agrilivestock.ecommerce.repository;

import com.agrilivestock.ecommerce.entity.Cart;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface CartRepository extends JpaRepository<Cart, Long> {

    @EntityGraph(attributePaths = {"items", "items.variant", "items.variant.product"})
    Optional<Cart> findByUserId(Long userId);
    @EntityGraph(attributePaths = {"items", "items.variant", "items.variant.product", "user"})
    org.springframework.data.domain.Page<Cart> findByItemsIsNotEmpty(org.springframework.data.domain.Pageable pageable);
}
