package com.agrilivestock.ecommerce.security;

import com.agrilivestock.ecommerce.config.properties.AppProperties;
import com.agrilivestock.ecommerce.entity.RefreshToken;
import com.agrilivestock.ecommerce.entity.User;
import com.agrilivestock.ecommerce.repository.RefreshTokenRepository;
import com.agrilivestock.ecommerce.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.Optional;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class RefreshTokenService {

    private final RefreshTokenRepository refreshTokenRepository;
    private final UserRepository userRepository;
    private final AppProperties appProperties;

    @Transactional
    public RefreshToken createRefreshToken(Long userId) {
        User user = userRepository.findById(userId).orElseThrow(() -> new RuntimeException("User not found"));
        
        Optional<RefreshToken> existingTokenOpt = refreshTokenRepository.findByUser(user);
        RefreshToken refreshToken = existingTokenOpt.orElse(new RefreshToken());
        
        refreshToken.setUser(user);
        refreshToken.setExpiryDate(Instant.now().plusMillis(appProperties.jwt().refreshExpirationMs()));
        refreshToken.setToken(UUID.randomUUID().toString());

        return refreshTokenRepository.save(refreshToken);
    }

    public Optional<RefreshToken> findByToken(String token) {
        return refreshTokenRepository.findByToken(token);
    }

    public RefreshToken verifyExpiration(RefreshToken token) {
        if (token.getExpiryDate().compareTo(Instant.now()) < 0) {
            refreshTokenRepository.delete(token);
            throw new RuntimeException(token.getToken() + " Refresh token was expired. Please make a new signin request");
        }
        return token;
    }

    @Transactional
    public int deleteByUserId(Long userId) {
        User user = userRepository.findById(userId).orElseThrow(() -> new RuntimeException("User not found"));
        return refreshTokenRepository.deleteByUser(user);
    }
}
