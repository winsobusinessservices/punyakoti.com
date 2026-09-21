package com.agrilivestock.ecommerce.service.impl;

import com.agrilivestock.ecommerce.dto.content.HowItWorksDto;
import com.agrilivestock.ecommerce.entity.HowItWorks;
import com.agrilivestock.ecommerce.exception.ResourceNotFoundException;
import com.agrilivestock.ecommerce.mapper.HowItWorksMapper;
import com.agrilivestock.ecommerce.repository.HowItWorksRepository;
import com.agrilivestock.ecommerce.service.HowItWorksService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class HowItWorksServiceImpl implements HowItWorksService {

    private final HowItWorksRepository repository;
    private final HowItWorksMapper mapper;

    @Override
    public List<HowItWorksDto> getAll() {
        return repository.findAll().stream()
                .map(mapper::toDto)
                .toList();
    }

    @Override
    @Transactional
    public HowItWorksDto create(HowItWorksDto dto) {
        HowItWorks entity = mapper.toEntity(dto);
        return mapper.toDto(repository.save(entity));
    }

    @Override
    @Transactional
    public HowItWorksDto update(Long id, HowItWorksDto dto) {
        HowItWorks entity = repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Item not found with id: " + id));
        entity.setTitle(dto.title());
        entity.setDescription(dto.description());
        entity.setVideoUrl(dto.videoUrl());
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
