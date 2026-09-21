package com.agrilivestock.ecommerce.service.impl;

import com.agrilivestock.ecommerce.dto.order.OrderRequest;
import com.agrilivestock.ecommerce.dto.order.OrderResponse;
import com.agrilivestock.ecommerce.dto.order.OrderStatusRequest;
import com.agrilivestock.ecommerce.entity.Address;
import com.agrilivestock.ecommerce.entity.Cart;
import com.agrilivestock.ecommerce.entity.Order;
import com.agrilivestock.ecommerce.entity.OrderItem;
import com.agrilivestock.ecommerce.entity.User;
import com.agrilivestock.ecommerce.enums.OrderStatus;
import com.agrilivestock.ecommerce.enums.Role;
import com.agrilivestock.ecommerce.exception.BadRequestException;
import com.agrilivestock.ecommerce.exception.ResourceNotFoundException;
import com.agrilivestock.ecommerce.mapper.OrderMapper;
import com.agrilivestock.ecommerce.repository.AddressRepository;
import com.agrilivestock.ecommerce.repository.CartItemRepository;
import com.agrilivestock.ecommerce.repository.CartRepository;
import com.agrilivestock.ecommerce.repository.OrderRepository;
import com.agrilivestock.ecommerce.response.PageResponse;
import com.agrilivestock.ecommerce.service.EmailService;
import com.agrilivestock.ecommerce.service.OrderService;
import com.agrilivestock.ecommerce.service.PaymentService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class OrderServiceImpl implements OrderService {

    private final OrderRepository orderRepository;
    private final CartRepository cartRepository;
    private final CartItemRepository cartItemRepository;
    private final AddressRepository addressRepository;
    private final OrderMapper orderMapper;
    private final PaymentService paymentService;
    private final EmailService emailService;

    @Override
    @Transactional
    public OrderResponse createOrder(User currentUser, OrderRequest request) {
        Cart cart = cartRepository.findByUserId(currentUser.getId())
                .orElseThrow(() -> new BadRequestException("Shopping cart is empty"));

        if (cart.getItems().isEmpty()) {
            throw new BadRequestException("Shopping cart is empty");
        }

        Address address = addressRepository.findById(request.addressId())
                .orElseThrow(() -> new ResourceNotFoundException("Address not found"));

        if (!address.getUser().getId().equals(currentUser.getId())) {
            throw new BadRequestException("Address does not belong to the user");
        }

        BigDecimal total = cart.getItems().stream()
                .map(item -> item.getVariant().getPrice().multiply(BigDecimal.valueOf(item.getQuantity())))
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        String orderNumber = "ORD-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase();

        Order order = Order.builder()
                .orderNumber(orderNumber)
                .user(currentUser)
                .status(OrderStatus.PENDING)
                .total(total)
                .shipFullName(address.getFullName())
                .shipPhone(address.getPhoneNumber())
                .shipLine1(address.getLine1())
                .shipLine2(address.getLine2())
                .shipCity(address.getCity())
                .shipState(address.getState())
                .shipPostalCode(address.getPostalCode())
                .shipCountry(address.getCountry())
                .build();

        List<OrderItem> orderItems = cart.getItems().stream().map(cartItem -> OrderItem.builder()
                .order(order)
                .variant(cartItem.getVariant())
                .productName(cartItem.getVariant().getProduct().getName())
                .variantWeight(cartItem.getVariant().getWeight())
                .unitPrice(cartItem.getVariant().getPrice())
                .quantity(cartItem.getQuantity())
                .lineTotal(cartItem.getVariant().getPrice()
                        .multiply(BigDecimal.valueOf(cartItem.getQuantity())))
                .build()).toList();

        orderItems.forEach(order::addItem);

        Order saved = orderRepository.save(order);

        try {
            String razorpayOrderId = paymentService.createRazorpayOrder(saved);
            saved.setRazorpayOrderId(razorpayOrderId);
            saved = orderRepository.save(saved);
        } catch (Exception e) {
            throw new BadRequestException("Failed to initialize payment gateway: " + e.getMessage());
        }

        return orderMapper.toResponse(saved);
    }

    @Override
    public PageResponse<OrderResponse> getUserOrders(User currentUser, Pageable pageable) {
        Page<Order> page = orderRepository.findByUserId(currentUser.getId(), pageable);
        List<OrderResponse> content = page.getContent().stream()
                .map(orderMapper::toResponse)
                .toList();
        return PageResponse.of(page, content);
    }

    @Override
    public OrderResponse getOrderById(User currentUser, Long orderId) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new ResourceNotFoundException("Order not found with id: " + orderId));

        if (!currentUser.getRole().equals(Role.ADMIN) && !order.getUser().getId().equals(currentUser.getId())) {
            throw new ResourceNotFoundException("Order not found for current user");
        }

        return orderMapper.toResponse(order);
    }

    @Override
    public PageResponse<OrderResponse> getAllOrdersAdmin(String search, Pageable pageable) {
        Page<Order> page;
        if (search != null && !search.trim().isEmpty()) {
            page = orderRepository.findAllBySearchCriteria(search.trim(), pageable);
        } else {
            page = orderRepository.findAll(pageable);
        }
        List<OrderResponse> content = page.getContent().stream()
                .map(orderMapper::toResponse)
                .toList();
        return PageResponse.of(page, content);
    }

    @Override
    @Transactional
    public OrderResponse updateOrderStatusAdmin(Long orderId, OrderStatusRequest request) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new ResourceNotFoundException("Order not found with id: " + orderId));
        order.setStatus(request.status());
        return orderMapper.toResponse(orderRepository.save(order));
    }

    @Override
    @Transactional
    public OrderResponse verifyPayment(User currentUser, Long orderId, com.agrilivestock.ecommerce.dto.order.PaymentVerificationRequest request) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new ResourceNotFoundException("Order not found with id: " + orderId));

        if (!order.getUser().getId().equals(currentUser.getId())) {
            throw new ResourceNotFoundException("Order not found for current user");
        }

        boolean isValid = paymentService.verifyPaymentSignature(
                request.razorpayOrderId(),
                request.razorpayPaymentId(),
                request.razorpaySignature()
        );

        if (isValid) {
            order.setPaymentId(request.razorpayPaymentId());
            order.setPaymentStatus("SUCCESS");
            // If payment is successful, transition to PROCESSING or leave it to Admin
            order.setStatus(OrderStatus.CONFIRMED);

            // Send confirmation email
            emailService.sendOrderConfirmation(
                    order.getUser().getEmail(),
                    order.getUser().getName(),
                    order.getOrderNumber(),
                    order.getTotal().toString()
            );

            // Clear the cart since payment was successful
            cartRepository.findByUserId(currentUser.getId()).ifPresent(cart -> {
                cartItemRepository.deleteAll(cart.getItems());
                cart.getItems().clear();
                cartRepository.save(cart);
            });
        } else {
            order.setPaymentStatus("FAILED");
            throw new BadRequestException("Payment signature verification failed");
        }

        return orderMapper.toResponse(orderRepository.save(order));
    }
}
