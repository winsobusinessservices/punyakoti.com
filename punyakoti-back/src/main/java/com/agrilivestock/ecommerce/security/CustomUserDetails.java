package com.agrilivestock.ecommerce.security;

import com.agrilivestock.ecommerce.entity.User;
import lombok.Getter;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Collection;
import java.util.List;

/**
 * Adapts the domain {@link User} to Spring Security's {@link UserDetails}.
 * Authentication is passwordless, so the credentials field is unused.
 */
@Getter
public class CustomUserDetails implements UserDetails {

    private final Long id;
    private final Long mobileNumber;
    private final boolean enabled;
    private final Collection<? extends GrantedAuthority> authorities;
    private final String email;
    private final String password;

    public CustomUserDetails(User user) {
        this.id = user.getId();
        this.mobileNumber = user.getMobileNumber();
        this.enabled = user.isEnabled();
        this.authorities = List.of(new SimpleGrantedAuthority("ROLE_" + user.getRole().name()));
        this.email = user.getEmail();
        this.password = user.getPassword();
    }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return authorities;
    }

    @Override
    public String getPassword() {
        return password;
    }

    @Override
    public String getUsername() {
        return email;
    }

    @Override
    public boolean isAccountNonExpired() {
        return true;
    }

    @Override
    public boolean isAccountNonLocked() {
        return true;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    @Override
    public boolean isEnabled() {
        return enabled;
    }
}
