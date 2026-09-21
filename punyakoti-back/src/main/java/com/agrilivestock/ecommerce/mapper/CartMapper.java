package com.agrilivestock.ecommerce.mapper;

import com.agrilivestock.ecommerce.dto.cart.CartDto;
import com.agrilivestock.ecommerce.dto.cart.CartItemDto;
import com.agrilivestock.ecommerce.entity.Cart;
import com.agrilivestock.ecommerce.entity.CartItem;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring", uses = {ProductMapper.class})
public interface CartMapper {

    CartDto toDto(Cart cart);

    @Mapping(target = "product", source = "variant.product")
    CartItemDto toItemDto(CartItem item);
}
