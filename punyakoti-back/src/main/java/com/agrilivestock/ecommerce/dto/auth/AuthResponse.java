package com.agrilivestock.ecommerce.dto.auth;

import com.agrilivestock.ecommerce.dto.user.UserResponse;

public record AuthResponse(
        String token,
        String role,
        UserResponse user
) {}
