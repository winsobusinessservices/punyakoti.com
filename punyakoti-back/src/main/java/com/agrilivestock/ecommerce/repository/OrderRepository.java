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
}
