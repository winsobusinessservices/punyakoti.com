package com.agrilivestock.ecommerce.security;

import com.agrilivestock.ecommerce.config.properties.AppProperties;
import com.agrilivestock.ecommerce.entity.User;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.springframework.stereotype.Service;

import javax.crypto.SecretKey;
import java.util.Base64;
import java.util.Date;
import java.util.Map;

/**
 * Issues and validates signed JWT access tokens.
 */
@Service
public class JwtService {

    private final SecretKey signingKey;
    private final long expirationMs;
    private final String issuer;

    public JwtService(AppProperties appProperties) {
        AppProperties.Jwt jwt = appProperties.jwt();
        byte[] keyBytes = decodeSecret(jwt.secret());
        this.signingKey = Keys.hmacShaKeyFor(keyBytes);
        this.expirationMs = jwt.expirationMs();
        this.issuer = jwt.issuer();
    }

    /**
     * Generates a signed token embedding the user id (subject), mobile number and role.
     */
    public String generateToken(User user) {
        Date now = new Date();
        Date expiry = new Date(now.getTime() + expirationMs);
        return Jwts.builder()
                .subject(String.valueOf(user.getId()))
                .issuer(issuer)
                .claim("mobile", user.getMobileNumber())
                .claim("role", user.getRole().name())
                .issuedAt(now)
                .expiration(expiry)
                .signWith(signingKey)
                .compact();
    }

    public Long extractUserId(String token) {
        return Long.valueOf(parseClaims(token).getSubject());
    }

    public boolean isTokenValid(String token) {
        try {
            Claims claims = parseClaims(token);
            return claims.getExpiration().after(new Date());
        } catch (Exception ex) {
            return false;
        }
    }

    private Claims parseClaims(String token) {
        return Jwts.parser()
                .verifyWith(signingKey)
                .requireIssuer(issuer)
                .build()
                .parseSignedClaims(token)
                .getPayload();
    }

    private byte[] decodeSecret(String secret) {
        try {
            return Base64.getDecoder().decode(secret);
        } catch (IllegalArgumentException ex) {
            // Fall back to raw bytes if the secret is not Base64 encoded
            return secret.getBytes();
        }
    }
}
