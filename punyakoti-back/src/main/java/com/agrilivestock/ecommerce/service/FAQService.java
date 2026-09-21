package com.agrilivestock.ecommerce.service;

import com.agrilivestock.ecommerce.dto.content.FAQDto;
import java.util.List;

public interface FAQService {
    List<FAQDto> getAllFaqs();
    FAQDto createFaq(FAQDto dto);
    FAQDto updateFaq(Long id, FAQDto dto);
    void deleteFaq(Long id);
}
