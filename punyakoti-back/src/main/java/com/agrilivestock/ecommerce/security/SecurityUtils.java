package com.agrilivestock.ecommerce.security;

import com.agrilivestock.ecommerce.entity.User;
import com.agrilivestock.ecommerce.exception.UnauthorizedException;
import com.agrilivestock.ecommerce.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;

/**
 * Convenience Spring Component accessors for the currently authenticated principal.
 */
@Component
@RequiredArgsConstructor
public class SecurityUtils {

    private final UserRepository userRepository;

    public CustomUserDetails getCustomUserDetails() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !(authentication.getPrincipal() instanceof CustomUserDetails userDetails)) {
            throw new UnauthorizedException("No authenticated user found in the security context.");
        }
        return userDetails;
    }

    public User getCurrentUser() {
        Long userId = getCustomUserDetails().getId();
        return userRepository.findById(userId)
                .orElseThrow(() -> new UnauthorizedException("Authenticated user not found in database."));
    }

    public Long getCurrentUserId() {
        return getCustomUserDetails().getId();
    }

    public boolean isAuthenticated() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        return authentication != null
                && authentication.isAuthenticated()
                && authentication.getPrincipal() instanceof CustomUserDetails;
    }
}
