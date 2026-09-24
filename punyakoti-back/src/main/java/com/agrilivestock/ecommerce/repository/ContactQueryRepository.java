package com.agrilivestock.ecommerce.repository;

import com.agrilivestock.ecommerce.entity.ContactQuery;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ContactQueryRepository extends JpaRepository<ContactQuery, Long> {
    Page<ContactQuery> findAllByOrderByCreatedAtDesc(Pageable pageable);
}
