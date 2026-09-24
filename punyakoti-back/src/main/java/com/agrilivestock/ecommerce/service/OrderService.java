package com.agrilivestock.ecommerce.service;

import com.agrilivestock.ecommerce.dto.order.OrderRequest;
import com.agrilivestock.ecommerce.dto.order.OrderResponse;
import com.agrilivestock.ecommerce.dto.order.OrderStatusRequest;
import com.agrilivestock.ecommerce.entity.User;
import com.agrilivestock.ecommerce.response.PageResponse;
import org.springframework.data.domain.Pageable;

public interface OrderService {
    OrderResponse createOrder(User currentUser, OrderRequest request);
    PageResponse<OrderResponse> getUserOrders(User currentUser, Pageable pageable);
    OrderResponse getOrderById(User currentUser, Long orderId);
    PageResponse<OrderResponse> getAllOrdersAdmin(String search, Pageable pageable);
    OrderResponse updateOrderStatusAdmin(Long orderId, OrderStatusRequest request);
    OrderResponse verifyPayment(User currentUser, Long orderId, com.agrilivestock.ecommerce.dto.order.PaymentVerificationRequest request);
    boolean hasUserPurchasedProduct(User currentUser, Long productId);
}
