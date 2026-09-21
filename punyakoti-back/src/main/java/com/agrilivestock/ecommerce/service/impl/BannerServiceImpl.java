package com.agrilivestock.ecommerce.service.impl;

import com.agrilivestock.ecommerce.dto.content.BannerDto;
import com.agrilivestock.ecommerce.entity.Banner;
import com.agrilivestock.ecommerce.exception.ResourceNotFoundException;
import com.agrilivestock.ecommerce.mapper.BannerMapper;
import com.agrilivestock.ecommerce.repository.BannerRepository;
import com.agrilivestock.ecommerce.service.BannerService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class BannerServiceImpl implements BannerService {

    private final BannerRepository bannerRepository;
    private final BannerMapper bannerMapper;

    @Override
    public List<BannerDto> getAllBanners() {
        return bannerRepository.findAll().stream()
                .map(bannerMapper::toDto)
                .toList();
    }

    @Override
    @Transactional
    public BannerDto createBanner(BannerDto dto) {
        Banner banner = bannerMapper.toEntity(dto);
        return bannerMapper.toDto(bannerRepository.save(banner));
    }

    @Override
    @Transactional
    public BannerDto updateBanner(Long id, BannerDto dto) {
        Banner banner = bannerRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Banner not found with id: " + id));
        banner.setImage(dto.imageUrl());
        banner.setTitle(dto.title());
        banner.setSubtitle(dto.subtitle());
        banner.setButtonText(dto.buttonText());
        banner.setButtonUrl(dto.buttonUrl());
        return bannerMapper.toDto(bannerRepository.save(banner));
    }

    @Override
    @Transactional
    public void deleteBanner(Long id) {
        if (!bannerRepository.existsById(id)) {
            throw new ResourceNotFoundException("Banner not found with id: " + id);
        }
        bannerRepository.deleteById(id);
    }
}
