package com.agrilivestock.ecommerce.controller;

import com.agrilivestock.ecommerce.dto.auth.AuthResponse;
import com.agrilivestock.ecommerce.dto.auth.GoogleLoginRequest;
import com.agrilivestock.ecommerce.dto.auth.LoginRequest;
import com.agrilivestock.ecommerce.dto.auth.RegisterRequest;
import com.agrilivestock.ecommerce.response.ApiResponse;
import com.agrilivestock.ecommerce.service.AuthService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import java.util.Arrays;

@RestController
@RequestMapping("/api/v1/auth")
@RequiredArgsConstructor
@Tag(name = "Authentication", description = "Email/Password and Google OAuth authentication APIs")
public class AuthController {

    private final AuthService authService;
    private final com.agrilivestock.ecommerce.security.RefreshTokenService refreshTokenService;
    private final com.agrilivestock.ecommerce.security.JwtService jwtService;
    
    @Value("${app.jwt.refresh-expiration-ms:604800000}")
    private long refreshExpirationMs;

    @PostMapping("/register")
    @Operation(summary = "Register a new user")
    public ResponseEntity<ApiResponse<String>> register(@Valid @RequestBody RegisterRequest request) {
        authService.register(request);
        return ResponseEntity.ok(ApiResponse.success("Registration successful. Please check your email to verify your account.", null));
    }

    @GetMapping("/verify-email")
    @Operation(summary = "Verify user email")
    public ResponseEntity<ApiResponse<String>> verifyEmail(@RequestParam String token) {
        authService.verifyEmail(token);
        return ResponseEntity.ok(ApiResponse.success("Email verified successfully. You can now login.", null));
    }

    @PostMapping("/login")
    @Operation(summary = "Login with email and password")
    public ResponseEntity<ApiResponse<AuthResponse>> login(@Valid @RequestBody LoginRequest request, HttpServletResponse response) {
        AuthResponse authResponse = authService.login(request);
        setRefreshTokenCookie(response, authResponse.user().id());
        return ResponseEntity.ok(ApiResponse.success("Login successful", authResponse));
    }

    @PostMapping("/google")
    @Operation(summary = "Login with Google OAuth")
    public ResponseEntity<ApiResponse<AuthResponse>> googleLogin(@Valid @RequestBody GoogleLoginRequest request, HttpServletResponse response) {
        AuthResponse authResponse = authService.googleLogin(request);
        setRefreshTokenCookie(response, authResponse.user().id());
        return ResponseEntity.ok(ApiResponse.success("Google Login successful", authResponse));
    }

    @PostMapping("/logout")
    @Operation(summary = "Logout user")
    public ResponseEntity<ApiResponse<Void>> logout(HttpServletRequest request, HttpServletResponse response) {
        String refreshTokenString = null;
        if (request.getCookies() != null) {
            refreshTokenString = Arrays.stream(request.getCookies())
                    .filter(c -> "refreshToken".equals(c.getName()))
                    .map(Cookie::getValue)
                    .findFirst()
                    .orElse(null);
        }

        if (refreshTokenString != null) {
            refreshTokenService.findByToken(refreshTokenString).ifPresent(refreshToken -> {
                refreshTokenService.deleteByUserId(refreshToken.getUser().getId());
            });
        }

        // Clear Cookie
        Cookie cookie = new Cookie("refreshToken", "");
        cookie.setHttpOnly(true);
        cookie.setSecure(false);
        cookie.setPath("/");
        cookie.setMaxAge(0);
        response.addCookie(cookie);

        return ResponseEntity.ok(ApiResponse.success("Logged out successfully"));
    }

    @PostMapping("/refresh")
    @Operation(summary = "Refresh access token using HttpOnly cookie")
    public ResponseEntity<ApiResponse<com.agrilivestock.ecommerce.dto.auth.TokenRefreshResponse>> refreshToken(HttpServletRequest request) {
        String refreshTokenString = null;
        if (request.getCookies() != null) {
            refreshTokenString = Arrays.stream(request.getCookies())
                    .filter(c -> "refreshToken".equals(c.getName()))
                    .map(Cookie::getValue)
                    .findFirst()
                    .orElse(null);
        }

        if (refreshTokenString == null || refreshTokenString.isEmpty()) {
            return ResponseEntity.status(401).body(ApiResponse.error("Refresh Token is empty!"));
        }

        return refreshTokenService.findByToken(refreshTokenString)
                .map(refreshTokenService::verifyExpiration)
                .map(com.agrilivestock.ecommerce.entity.RefreshToken::getUser)
                .map(user -> {
                    String accessToken = jwtService.generateToken(user);
                    return ResponseEntity.ok(ApiResponse.success("Token refreshed", new com.agrilivestock.ecommerce.dto.auth.TokenRefreshResponse(accessToken)));
                })
                .orElseGet(() -> ResponseEntity.status(401).body(ApiResponse.error("Refresh token is not in database!")));
    }

    private void setRefreshTokenCookie(HttpServletResponse response, Long userId) {
        com.agrilivestock.ecommerce.entity.RefreshToken refreshToken = refreshTokenService.createRefreshToken(userId);
        Cookie cookie = new Cookie("refreshToken", refreshToken.getToken());
        cookie.setHttpOnly(true);
        cookie.setSecure(false); 
        cookie.setPath("/");
        cookie.setMaxAge((int) (refreshExpirationMs / 1000));
        response.addCookie(cookie);
    }
}
