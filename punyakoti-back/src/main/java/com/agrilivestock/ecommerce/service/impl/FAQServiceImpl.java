package com.agrilivestock.ecommerce.service.impl;

import com.agrilivestock.ecommerce.dto.content.FAQDto;
import com.agrilivestock.ecommerce.entity.Faq;
import com.agrilivestock.ecommerce.exception.ResourceNotFoundException;
import com.agrilivestock.ecommerce.mapper.FaqMapper;
import com.agrilivestock.ecommerce.repository.FaqRepository;
import com.agrilivestock.ecommerce.service.FAQService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class FAQServiceImpl implements FAQService {

    private final FaqRepository faqRepository;
    private final FaqMapper faqMapper;

    @Override
    public List<FAQDto> getAllFaqs() {
        return faqRepository.findAll().stream()
                .map(faqMapper::toDto)
                .toList();
    }

    @Override
    @Transactional
    public FAQDto createFaq(FAQDto dto) {
        Faq faq = faqMapper.toEntity(dto);
        return faqMapper.toDto(faqRepository.save(faq));
    }

    @Override
    @Transactional
    public FAQDto updateFaq(Long id, FAQDto dto) {
        Faq faq = faqRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("FAQ not found with id: " + id));
        faq.setQuestion(dto.question());
        faq.setAnswer(dto.answer());
        return faqMapper.toDto(faqRepository.save(faq));
    }

    @Override
    @Transactional
    public void deleteFaq(Long id) {
        if (!faqRepository.existsById(id)) {
            throw new ResourceNotFoundException("FAQ not found with id: " + id);
        }
        faqRepository.deleteById(id);
    }
}
