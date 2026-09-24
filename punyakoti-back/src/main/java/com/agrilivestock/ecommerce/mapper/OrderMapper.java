package com.agrilivestock.ecommerce.mapper;

import com.agrilivestock.ecommerce.dto.order.OrderItemResponse;
import com.agrilivestock.ecommerce.dto.order.OrderResponse;
import com.agrilivestock.ecommerce.dto.user.AddressDto;
import com.agrilivestock.ecommerce.entity.Order;
import com.agrilivestock.ecommerce.entity.OrderItem;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring", uses = {UserMapper.class})
public interface OrderMapper {

    @Mapping(target = "address", expression = "java(toAddressDto(order))")
    @Mapping(target = "name", source = "user.name")
    @Mapping(target = "phoneNumber", source = "user.mobileNumber")
    OrderResponse toResponse(Order order);

    @Mapping(target = "price", source = "unitPrice")
    @Mapping(target = "productId", source = "variant.product.id")
    OrderItemResponse toItemResponse(OrderItem item);

    default AddressDto toAddressDto(Order order) {
        return new AddressDto(
                null,
                order.getShipLine1(),
                order.getShipLine2(),
                order.getShipCity(),
                order.getShipState(),
                order.getShipPostalCode(),
                order.getShipCountry(),
                false
        );
    }
}
