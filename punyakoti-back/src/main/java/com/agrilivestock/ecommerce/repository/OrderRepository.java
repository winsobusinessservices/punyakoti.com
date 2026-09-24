package com.agrilivestock.ecommerce.repository;

import com.agrilivestock.ecommerce.entity.Order;
import com.agrilivestock.ecommerce.enums.OrderStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.util.Optional;

@Repository
public interface OrderRepository extends JpaRepository<Order, Long> {

    @EntityGraph(attributePaths = {"items", "user"})
    Page<Order> findByUserId(Long userId, Pageable pageable);

    @EntityGraph(attributePaths = {"items", "user"})
    Optional<Order> findByIdAndUserId(Long id, Long userId);

    @EntityGraph(attributePaths = {"items", "user"})
    Page<Order> findByStatus(OrderStatus status, Pageable pageable);

    @Override
    @EntityGraph(attributePaths = {"items", "user"})
    Page<Order> findAll(Pageable pageable);

    long countByStatus(OrderStatus status);

    @EntityGraph(attributePaths = {"items", "user"})
    @Query("SELECT o FROM Order o WHERE LOWER(o.orderNumber) LIKE LOWER(CONCAT('%', :search, '%')) OR LOWER(o.shipFullName) LIKE LOWER(CONCAT('%', :search, '%'))")
    Page<Order> findAllBySearchCriteria(String search, Pageable pageable);

    @Query("select coalesce(sum(o.total), 0) from Order o where o.status <> com.agrilivestock.ecommerce.enums.OrderStatus.CANCELLED")
    BigDecimal sumRevenue();

    @Query("select coalesce(sum(o.total), 0) from Order o where o.status <> com.agrilivestock.ecommerce.enums.OrderStatus.CANCELLED and o.createdAt >= :startDate and o.createdAt < :endDate")
    BigDecimal sumRevenueByDateRange(java.time.Instant startDate, java.time.Instant endDate);

    @Query("SELECT CASE WHEN COUNT(o) > 0 THEN true ELSE false END FROM Order o JOIN o.items i WHERE o.user.id = :userId AND i.variant.product.id = :productId AND o.status = com.agrilivestock.ecommerce.enums.OrderStatus.DELIVERED")
    boolean hasUserPurchasedProduct(Long userId, Long productId);
}
