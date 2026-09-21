package com.agrilivestock.ecommerce.service;

import com.agrilivestock.ecommerce.dto.content.BannerDto;
import java.util.List;

public interface BannerService {
    List<BannerDto> getAllBanners();
    BannerDto createBanner(BannerDto dto);
    BannerDto updateBanner(Long id, BannerDto dto);
    void deleteBanner(Long id);
}
