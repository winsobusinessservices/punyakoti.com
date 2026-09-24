package com.agrilivestock.ecommerce.controller;

import com.agrilivestock.ecommerce.dto.order.OrderRequest;
import com.agrilivestock.ecommerce.dto.order.OrderResponse;
import com.agrilivestock.ecommerce.entity.User;
import com.agrilivestock.ecommerce.response.ApiResponse;
import com.agrilivestock.ecommerce.response.PageResponse;
import com.agrilivestock.ecommerce.security.SecurityUtils;
import com.agrilivestock.ecommerce.service.OrderService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/orders")
@RequiredArgsConstructor
@Tag(name = "Orders", description = "Customer order checkout and history APIs")
public class OrderController {

    private final OrderService orderService;
    private final SecurityUtils securityUtils;

    @PostMapping
    @Operation(summary = "Place a new order from current cart")
    public ResponseEntity<ApiResponse<OrderResponse>> createOrder(@Valid @RequestBody OrderRequest request) {
        User currentUser = securityUtils.getCurrentUser();
        OrderResponse order = orderService.createOrder(currentUser, request);
        return ResponseEntity.ok(ApiResponse.success("Order placed successfully", order));
    }

    @GetMapping
    @Operation(summary = "Get user order history with pagination")
    public ResponseEntity<ApiResponse<PageResponse<OrderResponse>>> getUserOrders(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    ) {
        User currentUser = securityUtils.getCurrentUser();
        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "createdAt"));
        PageResponse<OrderResponse> orders = orderService.getUserOrders(currentUser, pageable);
        return ResponseEntity.ok(ApiResponse.success("Order history retrieved successfully", orders));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get order details by ID")
    public ResponseEntity<ApiResponse<OrderResponse>> getOrderById(@PathVariable Long id) {
        User currentUser = securityUtils.getCurrentUser();
        OrderResponse order = orderService.getOrderById(currentUser, id);
        return ResponseEntity.ok(ApiResponse.success("Order retrieved successfully", order));
    }

    @PostMapping("/{id}/verify")
    @Operation(summary = "Verify Razorpay payment signature")
    public ResponseEntity<ApiResponse<OrderResponse>> verifyPayment(
            @PathVariable Long id,
            @Valid @RequestBody com.agrilivestock.ecommerce.dto.order.PaymentVerificationRequest request) {
        User currentUser = securityUtils.getCurrentUser();
        OrderResponse order = orderService.verifyPayment(currentUser, id, request);
        return ResponseEntity.ok(ApiResponse.success("Payment verified successfully", order));
    }

    @GetMapping("/check-purchase")
    @Operation(summary = "Check if current user has purchased a product")
    public ResponseEntity<ApiResponse<Boolean>> checkPurchase(@RequestParam Long productId) {
        User currentUser = securityUtils.getCurrentUser();
        boolean hasPurchased = orderService.hasUserPurchasedProduct(currentUser, productId);
        return ResponseEntity.ok(ApiResponse.success("Purchase status retrieved", hasPurchased));
    }
}
