package com.agrilivestock.ecommerce.service;

import com.agrilivestock.ecommerce.dto.cart.CartAddRequest;
import com.agrilivestock.ecommerce.dto.cart.CartDto;
import com.agrilivestock.ecommerce.entity.User;

public interface CartService {
    CartDto getCart(User currentUser);
    CartDto addItemToCart(User currentUser, CartAddRequest request);
    CartDto updateItemQuantity(User currentUser, Long cartItemId, Integer quantity);
    CartDto removeItemFromCart(User currentUser, Long cartItemId);
    void clearCart(User currentUser);
    com.agrilivestock.ecommerce.response.PageResponse<com.agrilivestock.ecommerce.dto.cart.AdminCartDto> getAllAbandonedCarts(org.springframework.data.domain.Pageable pageable);
}
