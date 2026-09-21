package com.agrilivestock.ecommerce.service;

import com.agrilivestock.ecommerce.config.properties.AppProperties;
import com.agrilivestock.ecommerce.entity.Order;
import com.razorpay.RazorpayClient;
import com.razorpay.RazorpayException;
import com.razorpay.Utils;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.json.JSONObject;
import org.springframework.stereotype.Service;

import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;
import java.math.BigDecimal;
import java.nio.charset.StandardCharsets;
import java.util.Formatter;

@Service
@RequiredArgsConstructor
@Slf4j
public class PaymentService {

    private final AppProperties appProperties;

    public String createRazorpayOrder(Order order) throws RazorpayException {
        RazorpayClient razorpay = new RazorpayClient(
                appProperties.razorpay().keyId(),
                appProperties.razorpay().keySecret()
        );

        JSONObject orderRequest = new JSONObject();
        // Razorpay expects amount in subunits (paise for INR)
        BigDecimal amountInPaise = order.getTotal().multiply(new BigDecimal("100"));
        orderRequest.put("amount", amountInPaise.intValue());
        orderRequest.put("currency", "INR");
        orderRequest.put("receipt", order.getOrderNumber());

        com.razorpay.Order razorpayOrder = razorpay.orders.create(orderRequest);
        return razorpayOrder.get("id");
    }

    public boolean verifyPaymentSignature(String razorpayOrderId, String razorpayPaymentId, String razorpaySignature) {
        try {
            String secret = appProperties.razorpay().keySecret();
            String payload = razorpayOrderId + "|" + razorpayPaymentId;
            String generatedSignature = calculateHMac(payload, secret);
            return generatedSignature.equals(razorpaySignature);
        } catch (Exception e) {
            log.error("Failed to verify Razorpay signature", e);
            return false;
        }
    }

    private String calculateHMac(String data, String secret) throws Exception {
        Mac hmacSha256 = Mac.getInstance("HmacSHA256");
        SecretKeySpec secretKey = new SecretKeySpec(secret.getBytes(StandardCharsets.UTF_8), "HmacSHA256");
        hmacSha256.init(secretKey);
        byte[] hash = hmacSha256.doFinal(data.getBytes(StandardCharsets.UTF_8));
        Formatter formatter = new Formatter();
        for (byte b : hash) {
            formatter.format("%02x", b);
        }
        String hex = formatter.toString();
        formatter.close();
        return hex;
    }
}
