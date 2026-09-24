package com.agrilivestock.ecommerce.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;

@Service
@RequiredArgsConstructor
@Slf4j
public class EmailService {

    private final JavaMailSender mailSender;

    @Value("${spring.mail.username}")
    private String fromEmail;

    @Value("${app.url:http://localhost:5173}")
    private String appUrl;

    public void sendVerificationEmail(String toEmail, String name, String token) {
        String subject = "Verify your email - Punyakoti";
        String verificationUrl = appUrl + "/verify-email?token=" + token;
        
        String content = "<h1>Welcome to Punyakoti, " + name + "!</h1>"
                + "<p>Please verify your email address by clicking the link below:</p>"
                + "<a href=\"" + verificationUrl + "\">Verify Email</a>"
                + "<p>Or copy this link: " + verificationUrl + "</p>";

        sendHtmlEmail(toEmail, subject, content);
    }

    public void sendOrderConfirmation(String toEmail, String name, String orderId, String amount) {
        String subject = "Order Confirmed - Punyakoti";
        
        String content = "<h1>Thank you for your order, " + name + "!</h1>"
                + "<p>Your order (ID: " + orderId + ") has been successfully placed.</p>"
                + "<p>Total Amount: ₹" + amount + "</p>"
                + "<p>We will notify you once it ships!</p>";

        sendHtmlEmail(toEmail, subject, content);
    }

    public void sendContactQueryEmailToAdmin(String name, String email, String phone, String subjectLine, String message) {
        String subject = "New Contact Query: " + subjectLine;
        
        String content = "<h1>New Contact Submission</h1>"
                + "<p><strong>Name:</strong> " + name + "</p>"
                + "<p><strong>Email:</strong> " + email + "</p>"
                + "<p><strong>Phone:</strong> " + phone + "</p>"
                + "<p><strong>Message:</strong><br/>" + message.replace("\n", "<br/>") + "</p>";

        // Send to the 'fromEmail' itself as the admin email, or a dedicated admin email
        sendHtmlEmail(fromEmail, subject, content);
    }

    private void sendHtmlEmail(String to, String subject, String htmlContent) {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");
            
            helper.setFrom(fromEmail);
            helper.setTo(to);
            helper.setSubject(subject);
            helper.setText(htmlContent, true);
            
            mailSender.send(message);
                log.info("Email sent to: {}", to);
        } catch (MessagingException e) {
            log.error("Failed to send email to {}", to, e);
        }
    }
}
