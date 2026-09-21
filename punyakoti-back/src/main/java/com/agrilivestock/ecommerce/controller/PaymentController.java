package com.agrilivestock.ecommerce.controller;

import com.agrilivestock.ecommerce.dto.order.OrderRequest;
import com.agrilivestock.ecommerce.dto.order.OrderResponse;
import com.agrilivestock.ecommerce.dto.payment.PaymentCreateResponse;
import com.agrilivestock.ecommerce.dto.payment.PaymentVerifyRequest;
import com.agrilivestock.ecommerce.entity.Order;
import com.agrilivestock.ecommerce.enums.OrderStatus;
import com.agrilivestock.ecommerce.repository.OrderRepository;
import com.agrilivestock.ecommerce.response.ApiResponse;
import com.agrilivestock.ecommerce.security.SecurityUtils;
import com.agrilivestock.ecommerce.service.EmailService;
import com.agrilivestock.ecommerce.service.OrderService;
import com.agrilivestock.ecommerce.service.RazorpayService;
import com.razorpay.RazorpayException;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.math.BigDecimal;

@RestController
@RequestMapping("/api/v1/payments")
@RequiredArgsConstructor
@Tag(name = "Payment", description = "Razorpay payment integration APIs")
@Slf4j
public class PaymentController {

    private final OrderService orderService;
    private final OrderRepository orderRepository;
    private final RazorpayService razorpayService;
    private final EmailService emailService;
    private final SecurityUtils securityUtils;

    @PostMapping("/create-order")
    @Operation(summary = "Create a new Razorpay order")
    public ResponseEntity<ApiResponse<PaymentCreateResponse>> createOrder(@Valid @RequestBody OrderRequest request) {
        try {
            // 1. Create a local order with PENDING status
            OrderResponse localOrder = orderService.createOrder(securityUtils.getCurrentUser(), request);
            
            Order order = orderRepository.findById(localOrder.id())
                    .orElseThrow(() -> new IllegalArgumentException("Order not found"));

            // 2. Create Razorpay order
            com.razorpay.Order rzpOrder = razorpayService.createOrder(order.getTotal(), order.getOrderNumber());
            
            String razorpayOrderId = rzpOrder.get("id");
            order.setRazorpayOrderId(razorpayOrderId);
            orderRepository.save(order);

            PaymentCreateResponse response = new PaymentCreateResponse(
                    razorpayOrderId,
                    "INR",
                    order.getTotal().multiply(new BigDecimal("100")).longValue(), // paise
                    order.getId()
            );

            return ResponseEntity.ok(ApiResponse.success("Payment order created", response));
            
        } catch (RazorpayException e) {
            log.error("Error creating Razorpay order", e);
            return ResponseEntity.badRequest().body(ApiResponse.error("Failed to initialize payment gateway"));
        }
    }

    @PostMapping("/verify")
    @Operation(summary = "Verify Razorpay payment signature")
    public ResponseEntity<ApiResponse<String>> verifyPayment(@Valid @RequestBody PaymentVerifyRequest request) {
        boolean isValid = razorpayService.verifySignature(
                request.razorpayOrderId(), 
                request.razorpayPaymentId(), 
                request.razorpaySignature()
        );

        if (!isValid) {
            return ResponseEntity.badRequest().body(ApiResponse.error("Invalid payment signature"));
        }

        Order order = orderRepository.findById(request.localOrderId())
                .orElseThrow(() -> new IllegalArgumentException("Order not found"));

        if (!order.getRazorpayOrderId().equals(request.razorpayOrderId())) {
            return ResponseEntity.badRequest().body(ApiResponse.error("Order ID mismatch"));
        }

        // Update local order
        order.setPaymentId(request.razorpayPaymentId());
        order.setPaymentStatus("PAID");
        order.setStatus(OrderStatus.CONFIRMED);
        orderRepository.save(order);

        // Send Order Confirmation Email
        emailService.sendOrderConfirmation(
                order.getUser().getEmail(), 
                order.getUser().getName(), 
                order.getOrderNumber(), 
                order.getTotal().toString()
        );

        return ResponseEntity.ok(ApiResponse.success("Payment verified successfully", null));
    }
}
