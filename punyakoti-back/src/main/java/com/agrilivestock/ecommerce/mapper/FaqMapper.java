package com.agrilivestock.ecommerce.mapper;

import com.agrilivestock.ecommerce.dto.content.FAQDto;
import com.agrilivestock.ecommerce.entity.Faq;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface FaqMapper {
    FAQDto toDto(Faq faq);
    Faq toEntity(FAQDto dto);
}
