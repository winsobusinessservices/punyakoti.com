package com.agrilivestock.ecommerce.controller;

import com.agrilivestock.ecommerce.dto.cart.CartAddRequest;
import com.agrilivestock.ecommerce.dto.cart.CartDto;
import com.agrilivestock.ecommerce.entity.User;
import com.agrilivestock.ecommerce.response.ApiResponse;
import com.agrilivestock.ecommerce.security.SecurityUtils;
import com.agrilivestock.ecommerce.service.CartService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/cart")
@RequiredArgsConstructor
@Tag(name = "Shopping Cart", description = "User shopping cart management APIs")
public class CartController {

    private final CartService cartService;
    private final SecurityUtils securityUtils;

    @GetMapping
    @Operation(summary = "Get user shopping cart")
    public ResponseEntity<ApiResponse<CartDto>> getCart() {
        User currentUser = securityUtils.getCurrentUser();
        CartDto cart = cartService.getCart(currentUser);
        return ResponseEntity.ok(ApiResponse.success("Cart retrieved successfully", cart));
    }

    @PostMapping
    @Operation(summary = "Add item to cart")
    public ResponseEntity<ApiResponse<CartDto>> addItem(@Valid @RequestBody CartAddRequest request) {
        User currentUser = securityUtils.getCurrentUser();
        CartDto cart = cartService.addItemToCart(currentUser, request);
        return ResponseEntity.ok(ApiResponse.success("Item added to cart successfully", cart));
    }

    @PutMapping("/{itemId}")
    @Operation(summary = "Update item quantity in cart")
    public ResponseEntity<ApiResponse<CartDto>> updateQuantity(
            @PathVariable Long itemId,
            @RequestParam Integer quantity
    ) {
        User currentUser = securityUtils.getCurrentUser();
        CartDto cart = cartService.updateItemQuantity(currentUser, itemId, quantity);
        return ResponseEntity.ok(ApiResponse.success("Cart updated successfully", cart));
    }

    @DeleteMapping("/{itemId}")
    @Operation(summary = "Remove item from cart")
    public ResponseEntity<ApiResponse<CartDto>> removeItem(@PathVariable Long itemId) {
        User currentUser = securityUtils.getCurrentUser();
        CartDto cart = cartService.removeItemFromCart(currentUser, itemId);
        return ResponseEntity.ok(ApiResponse.success("Item removed from cart successfully", cart));
    }

    @DeleteMapping
    @Operation(summary = "Clear shopping cart")
    public ResponseEntity<ApiResponse<Void>> clearCart() {
        User currentUser = securityUtils.getCurrentUser();
        cartService.clearCart(currentUser);
        return ResponseEntity.ok(ApiResponse.success("Cart cleared successfully"));
    }
}
