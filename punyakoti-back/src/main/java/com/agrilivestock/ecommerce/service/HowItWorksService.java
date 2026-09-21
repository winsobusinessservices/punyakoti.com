package com.agrilivestock.ecommerce.service;

import com.agrilivestock.ecommerce.dto.content.HowItWorksDto;
import java.util.List;

public interface HowItWorksService {
    List<HowItWorksDto> getAll();
    HowItWorksDto create(HowItWorksDto dto);
    HowItWorksDto update(Long id, HowItWorksDto dto);
    void delete(Long id);
}
