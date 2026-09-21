package com.agrilivestock.ecommerce.service;

import com.razorpay.Order;
import com.razorpay.RazorpayClient;
import com.razorpay.RazorpayException;
import com.razorpay.Utils;
import lombok.extern.slf4j.Slf4j;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import jakarta.annotation.PostConstruct;
import java.math.BigDecimal;
import java.math.RoundingMode;

@Service
@Slf4j
public class RazorpayService {

    @Value("${app.razorpay.key-id}")
    private String keyId;

    @Value("${app.razorpay.key-secret}")
    private String keySecret;

    private RazorpayClient client;

    @PostConstruct
    public void init() {
        try {
            this.client = new RazorpayClient(keyId, keySecret);
        } catch (RazorpayException e) {
            log.error("Failed to initialize Razorpay Client", e);
        }
    }

    public Order createOrder(BigDecimal amount, String receipt) throws RazorpayException {
        JSONObject orderRequest = new JSONObject();
        
        // Amount is in paise (multiply by 100)
        long amountInPaise = amount.multiply(new BigDecimal("100")).setScale(0, RoundingMode.HALF_UP).longValue();
        
        orderRequest.put("amount", amountInPaise);
        orderRequest.put("currency", "INR");
        orderRequest.put("receipt", receipt);

        return client.orders.create(orderRequest);
    }

    public boolean verifySignature(String orderId, String paymentId, String signature) {
        try {
            JSONObject options = new JSONObject();
            options.put("razorpay_order_id", orderId);
            options.put("razorpay_payment_id", paymentId);
            options.put("razorpay_signature", signature);
            
            return Utils.verifyPaymentSignature(options, keySecret);
        } catch (RazorpayException e) {
            log.error("Failed to verify Razorpay signature", e);
            return false;
        }
    }
}
