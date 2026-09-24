package com.agrilivestock.ecommerce.mapper;

import com.agrilivestock.ecommerce.dto.contact.ContactQueryResponse;
import com.agrilivestock.ecommerce.entity.ContactQuery;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface ContactQueryMapper {

    ContactQueryResponse toResponse(ContactQuery entity);
}
