package com.agrilivestock.ecommerce.repository;

import com.agrilivestock.ecommerce.entity.ProductMedia;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ProductMediaRepository extends JpaRepository<ProductMedia, Long> {
}
