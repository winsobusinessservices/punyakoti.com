package com.agrilivestock.ecommerce.repository;

import com.agrilivestock.ecommerce.entity.WhyChooseUs;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface WhyChooseUsRepository extends JpaRepository<WhyChooseUs, Long> {

    List<WhyChooseUs> findByActiveTrueOrderByDisplayOrderAsc();
}
