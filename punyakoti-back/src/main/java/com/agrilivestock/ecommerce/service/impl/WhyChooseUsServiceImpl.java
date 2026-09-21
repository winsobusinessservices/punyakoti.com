package com.agrilivestock.ecommerce.service.impl;

import com.agrilivestock.ecommerce.dto.content.WhyChooseUsDto;
import com.agrilivestock.ecommerce.entity.WhyChooseUs;
import com.agrilivestock.ecommerce.exception.ResourceNotFoundException;
import com.agrilivestock.ecommerce.mapper.WhyChooseUsMapper;
import com.agrilivestock.ecommerce.repository.WhyChooseUsRepository;
import com.agrilivestock.ecommerce.service.WhyChooseUsService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class WhyChooseUsServiceImpl implements WhyChooseUsService {

    private final WhyChooseUsRepository repository;
    private final WhyChooseUsMapper mapper;

    @Override
    public List<WhyChooseUsDto> getAll() {
        return repository.findAll().stream()
                .map(mapper::toDto)
                .toList();
    }

    @Override
    @Transactional
    public WhyChooseUsDto create(WhyChooseUsDto dto) {
        WhyChooseUs entity = mapper.toEntity(dto);
        return mapper.toDto(repository.save(entity));
    }

    @Override
    @Transactional
    public WhyChooseUsDto update(Long id, WhyChooseUsDto dto) {
        WhyChooseUs entity = repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Item not found with id: " + id));
        entity.setTitle(dto.title());
        entity.setDescription(dto.description());
        entity.setIcon(dto.icon());
        return mapper.toDto(repository.save(entity));
    }

    @Override
    @Transactional
    public void delete(Long id) {
        if (!repository.existsById(id)) {
            throw new ResourceNotFoundException("Item not found with id: " + id);
        }
        repository.deleteById(id);
    }
}
