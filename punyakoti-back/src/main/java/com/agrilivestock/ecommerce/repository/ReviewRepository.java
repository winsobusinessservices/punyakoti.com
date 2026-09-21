package com.agrilivestock.ecommerce.repository;

import com.agrilivestock.ecommerce.entity.Review;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ReviewRepository extends JpaRepository<Review, Long> {

    @EntityGraph(attributePaths = {"product", "user"})
    Page<Review> findByProductIdAndApprovedTrue(Long productId, Pageable pageable);

    @EntityGraph(attributePaths = {"product", "user"})
    List<Review> findByProductIdAndApprovedTrue(Long productId);

    @EntityGraph(attributePaths = {"product", "user"})
    Page<Review> findByApproved(boolean approved, Pageable pageable);

    @Override
    @EntityGraph(attributePaths = {"product", "user"})
    Page<Review> findAll(Pageable pageable);

    @EntityGraph(attributePaths = {"product", "user"})
    Page<Review> findByApprovedTrue(Pageable pageable);

    long countByApprovedFalse();
}
