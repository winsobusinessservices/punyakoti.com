package com.agrilivestock.ecommerce.repository;

import com.agrilivestock.ecommerce.entity.HowItWorks;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface HowItWorksRepository extends JpaRepository<HowItWorks, Long> {

    List<HowItWorks> findByActiveTrueOrderByDisplayOrderAsc();
}
