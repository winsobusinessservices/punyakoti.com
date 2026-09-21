package com.agrilivestock.ecommerce.mapper;

import com.agrilivestock.ecommerce.dto.content.WhyChooseUsDto;
import com.agrilivestock.ecommerce.entity.WhyChooseUs;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface WhyChooseUsMapper {
    WhyChooseUsDto toDto(WhyChooseUs entity);
    WhyChooseUs toEntity(WhyChooseUsDto dto);
}
