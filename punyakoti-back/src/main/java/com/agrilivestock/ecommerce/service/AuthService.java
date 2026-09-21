package com.agrilivestock.ecommerce.service;

import com.agrilivestock.ecommerce.dto.auth.AuthResponse;
import com.agrilivestock.ecommerce.dto.auth.GoogleLoginRequest;
import com.agrilivestock.ecommerce.dto.auth.LoginRequest;
import com.agrilivestock.ecommerce.dto.auth.RegisterRequest;
import com.agrilivestock.ecommerce.dto.user.UserResponse;
import com.agrilivestock.ecommerce.entity.User;
import com.agrilivestock.ecommerce.entity.VerificationToken;
import com.agrilivestock.ecommerce.enums.Role;
import com.agrilivestock.ecommerce.mapper.UserMapper;
import com.agrilivestock.ecommerce.repository.UserRepository;
import com.agrilivestock.ecommerce.repository.VerificationTokenRepository;
import com.agrilivestock.ecommerce.security.JwtService;
import com.google.api.client.googleapis.auth.oauth2.GoogleIdToken;
import com.google.api.client.googleapis.auth.oauth2.GoogleIdTokenVerifier;
import com.google.api.client.http.javanet.NetHttpTransport;
import com.google.api.client.json.gson.GsonFactory;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.Collections;
import java.util.Optional;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j
public class AuthService {

    private final UserRepository userRepository;
    private final VerificationTokenRepository tokenRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;
    private final EmailService emailService;
    private final UserMapper userMapper;

    @Value("${app.google.client-id}")
    private String googleClientId;

    @Transactional
    public void register(RegisterRequest request) {
        if (userRepository.existsByEmail(request.email())) {
            throw new IllegalArgumentException("Email is already registered");
        }

        User user = User.builder()
                .name(request.name())
                .email(request.email())
                .password(passwordEncoder.encode(request.password()))
                .mobileNumber(Long.parseLong(request.mobileNumber()))
                .role(Role.CUSTOMER)
                .enabled(true)
                .emailVerified(false)
                .build();

        user = userRepository.save(user);

        String token = UUID.randomUUID().toString();
        VerificationToken verificationToken = VerificationToken.builder()
                .token(token)
                .user(user)
                .expiryDate(Instant.now().plus(24, ChronoUnit.HOURS))
                .build();

        tokenRepository.save(verificationToken);

        emailService.sendVerificationEmail(user.getEmail(), user.getName(), token);
    }

    @Transactional
    public void verifyEmail(String tokenStr) {
        VerificationToken token = tokenRepository.findByToken(tokenStr)
                .orElseThrow(() -> new IllegalArgumentException("Invalid verification token"));

        if (token.getExpiryDate().isBefore(Instant.now())) {
            throw new IllegalArgumentException("Token has expired");
        }

        User user = token.getUser();
        user.setEmailVerified(true);
        userRepository.save(user);

        tokenRepository.delete(token);
    }

    public AuthResponse login(LoginRequest request) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.email(), request.password())
        );

        User user = userRepository.findByEmail(request.email())
                .orElseThrow(() -> new IllegalArgumentException("Invalid email or password"));

        if (!user.isEmailVerified()) {
            throw new IllegalArgumentException("Email not verified. Please check your inbox.");
        }

        user.setLastLogin(Instant.now());
        userRepository.save(user);

        String token = jwtService.generateToken(user);
        UserResponse userResponse = userMapper.toResponse(user);

        return new AuthResponse(token, user.getRole().name(), userResponse);
    }

    @Transactional
    public AuthResponse googleLogin(GoogleLoginRequest request) {
        try {
            org.springframework.web.client.RestTemplate restTemplate = new org.springframework.web.client.RestTemplate();
            org.springframework.http.HttpHeaders headers = new org.springframework.http.HttpHeaders();
            headers.setBearerAuth(request.token());
            org.springframework.http.HttpEntity<String> entity = new org.springframework.http.HttpEntity<>("", headers);
            
            org.springframework.http.ResponseEntity<java.util.Map> response = restTemplate.exchange(
                    "https://www.googleapis.com/oauth2/v3/userinfo", 
                    org.springframework.http.HttpMethod.GET, 
                    entity, 
                    java.util.Map.class
            );

            java.util.Map<String, Object> payload = response.getBody();
            if (payload != null && payload.containsKey("email")) {
                String email = (String) payload.get("email");
                String name = (String) payload.get("name");
                String googleId = (String) payload.get("sub");

                Optional<User> optionalUser = userRepository.findByEmail(email);
                User user;

                if (optionalUser.isPresent()) {
                    user = optionalUser.get();
                    if (user.getGoogleId() == null) {
                        user.setGoogleId(googleId);
                    }
                    user.setEmailVerified(true); // Google emails are verified
                } else {
                    user = User.builder()
                            .name(name)
                            .email(email)
                            .googleId(googleId)
                            .role(Role.CUSTOMER)
                            .enabled(true)
                            .emailVerified(true)
                            .build();
                }

                user.setLastLogin(Instant.now());
                user = userRepository.save(user);

                String jwt = jwtService.generateToken(user);
                UserResponse userResponse = userMapper.toResponse(user);

                return new AuthResponse(jwt, user.getRole().name(), userResponse);
            } else {
                throw new IllegalArgumentException("Invalid Google token or unable to fetch user info.");
            }
        } catch (Exception e) {
            log.error("Google login failed", e);
            throw new IllegalArgumentException("Google authentication failed: " + e.getMessage());
        }
    }

    public User getUserById(Long userId) {
        return userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));
    }
}
