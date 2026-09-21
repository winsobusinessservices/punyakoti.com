package com.agrilivestock.ecommerce.dto.auth;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class TokenRefreshResponse {
    private String accessToken;
    private String tokenType = "Bearer";

    public TokenRefreshResponse(String accessToken) {
        this.accessToken = accessToken;
    }
}
