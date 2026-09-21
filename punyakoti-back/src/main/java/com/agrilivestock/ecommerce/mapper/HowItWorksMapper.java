package com.agrilivestock.ecommerce.mapper;

import com.agrilivestock.ecommerce.dto.content.HowItWorksDto;
import com.agrilivestock.ecommerce.entity.HowItWorks;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface HowItWorksMapper {
    HowItWorksDto toDto(HowItWorks entity);
    HowItWorks toEntity(HowItWorksDto dto);
}
