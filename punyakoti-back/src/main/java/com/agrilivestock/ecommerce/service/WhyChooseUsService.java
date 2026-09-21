package com.agrilivestock.ecommerce.service;

import com.agrilivestock.ecommerce.dto.content.WhyChooseUsDto;
import java.util.List;

public interface WhyChooseUsService {
    List<WhyChooseUsDto> getAll();
    WhyChooseUsDto create(WhyChooseUsDto dto);
    WhyChooseUsDto update(Long id, WhyChooseUsDto dto);
    void delete(Long id);
}
