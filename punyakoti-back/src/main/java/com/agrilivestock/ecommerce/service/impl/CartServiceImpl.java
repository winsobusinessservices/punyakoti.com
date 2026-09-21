package com.agrilivestock.ecommerce.service.impl;

import com.agrilivestock.ecommerce.dto.cart.CartAddRequest;
import com.agrilivestock.ecommerce.dto.cart.CartDto;
import com.agrilivestock.ecommerce.entity.Cart;
import com.agrilivestock.ecommerce.entity.CartItem;
import com.agrilivestock.ecommerce.entity.ProductVariant;
import com.agrilivestock.ecommerce.entity.User;
import com.agrilivestock.ecommerce.exception.BadRequestException;
import com.agrilivestock.ecommerce.exception.ResourceNotFoundException;
import com.agrilivestock.ecommerce.mapper.CartMapper;
import com.agrilivestock.ecommerce.repository.CartItemRepository;
import com.agrilivestock.ecommerce.repository.CartRepository;
import com.agrilivestock.ecommerce.repository.ProductVariantRepository;
import com.agrilivestock.ecommerce.service.CartService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.Optional;

@Service
@RequiredArgsConstructor
@Transactional
public class CartServiceImpl implements CartService {

    private final CartRepository cartRepository;
    private final CartItemRepository cartItemRepository;
    private final ProductVariantRepository productVariantRepository;
    private final CartMapper cartMapper;

    private Cart getOrCreateUserCart(User user) {
        return cartRepository.findByUserId(user.getId())
                .orElseGet(() -> {
                    Cart newCart = Cart.builder().user(user).build();
                    return cartRepository.save(newCart);
                });
    }

    private BigDecimal calculateTotal(Cart cart) {
        return cart.getItems().stream()
                .map(item -> item.getVariant().getPrice().multiply(BigDecimal.valueOf(item.getQuantity())))
                .reduce(BigDecimal.ZERO, BigDecimal::add);
    }

    @Override
    public CartDto getCart(User currentUser) {
        Cart cart = getOrCreateUserCart(currentUser);
        CartDto dto = cartMapper.toDto(cart);
        return new CartDto(dto.id(), dto.items(), calculateTotal(cart));
    }

    @Override
    public CartDto addItemToCart(User currentUser, CartAddRequest request) {
        Cart cart = getOrCreateUserCart(currentUser);
        ProductVariant variant = productVariantRepository.findById(request.variantId())
                .orElseThrow(() -> new ResourceNotFoundException("Variant not found"));

        if (!variant.getProduct().getId().equals(request.productId())) {
            throw new BadRequestException("Variant does not belong to the requested product");
        }

        Optional<CartItem> existingItem = cart.getItems().stream()
                .filter(item -> item.getVariant().getId().equals(variant.getId()))
                .findFirst();

        if (existingItem.isPresent()) {
            CartItem item = existingItem.get();
            item.setQuantity(item.getQuantity() + request.quantity());
            cartItemRepository.save(item);
        } else {
            CartItem newItem = CartItem.builder()
                    .cart(cart)
                    .variant(variant)
                    .quantity(request.quantity())
                    .build();
            cart.getItems().add(newItem);
            cartItemRepository.save(newItem);
        }

        Cart updated = cartRepository.save(cart);
        CartDto dto = cartMapper.toDto(updated);
        return new CartDto(dto.id(), dto.items(), calculateTotal(updated));
    }

    @Override
    public CartDto updateItemQuantity(User currentUser, Long cartItemId, Integer quantity) {
        Cart cart = getOrCreateUserCart(currentUser);
        CartItem item = cartItemRepository.findById(cartItemId)
                .orElseThrow(() -> new ResourceNotFoundException("Cart item not found"));

        if (!item.getCart().getId().equals(cart.getId())) {
            throw new ResourceNotFoundException("Item does not belong to current user cart");
        }

        if (quantity <= 0) {
            cart.getItems().remove(item);
            cartItemRepository.delete(item);
        } else {
            item.setQuantity(quantity);
            cartItemRepository.save(item);
        }

        Cart updated = cartRepository.save(cart);
        CartDto dto = cartMapper.toDto(updated);
        return new CartDto(dto.id(), dto.items(), calculateTotal(updated));
    }

    @Override
    public CartDto removeItemFromCart(User currentUser, Long cartItemId) {
        return updateItemQuantity(currentUser, cartItemId, 0);
    }

    @Override
    public void clearCart(User currentUser) {
        Cart cart = getOrCreateUserCart(currentUser);
        cartItemRepository.deleteAll(cart.getItems());
        cart.getItems().clear();
        cartRepository.save(cart);
    }

    @Override
    public com.agrilivestock.ecommerce.response.PageResponse<com.agrilivestock.ecommerce.dto.cart.AdminCartDto> getAllAbandonedCarts(org.springframework.data.domain.Pageable pageable) {
        org.springframework.data.domain.Page<Cart> page = cartRepository.findByItemsIsNotEmpty(pageable);
        java.util.List<com.agrilivestock.ecommerce.dto.cart.AdminCartDto> content = page.getContent().stream().map(cart -> {
            CartDto dto = cartMapper.toDto(cart);
            return new com.agrilivestock.ecommerce.dto.cart.AdminCartDto(
                    cart.getId(),
                    cart.getUser().getId(),
                    cart.getUser().getName(),
                    cart.getUser().getEmail(),
                    cart.getUser().getMobileNumber().toString(),
                    dto.items(),
                    calculateTotal(cart),
                    cart.getUpdatedAt()
            );
        }).toList();
        return com.agrilivestock.ecommerce.response.PageResponse.of(page, content);
    }
}
