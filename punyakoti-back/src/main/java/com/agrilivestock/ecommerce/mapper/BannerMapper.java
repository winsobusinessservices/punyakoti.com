package com.agrilivestock.ecommerce.mapper;

import com.agrilivestock.ecommerce.dto.content.BannerDto;
import com.agrilivestock.ecommerce.entity.Banner;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface BannerMapper {

    @Mapping(target = "imageUrl", source = "image")
    BannerDto toDto(Banner entity);

    @Mapping(target = "image", source = "imageUrl")
    Banner toEntity(BannerDto dto);
}
