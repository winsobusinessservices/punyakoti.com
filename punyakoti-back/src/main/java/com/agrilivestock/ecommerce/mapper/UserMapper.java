package com.agrilivestock.ecommerce.mapper;

import com.agrilivestock.ecommerce.dto.user.AddressDto;
import com.agrilivestock.ecommerce.dto.user.UserResponse;
import com.agrilivestock.ecommerce.entity.Address;
import com.agrilivestock.ecommerce.entity.User;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface UserMapper {

    @Mapping(target = "role", expression = "java(user.getRole().name())")
    UserResponse toResponse(User user);

    AddressDto toAddressDto(Address address);
    @Mapping(target = "user", ignore = true)
    Address toAddressEntity(AddressDto dto);
}
