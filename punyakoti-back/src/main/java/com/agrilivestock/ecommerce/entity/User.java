package com.agrilivestock.ecommerce.entity;

import com.agrilivestock.ecommerce.enums.Role;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.Index;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.Instant;
import java.util.ArrayList;
import java.util.List;

/**
 * A platform user. Authentication is passwordless (mobile number + OTP).
 */
@Entity
@Table(name = "users", indexes = {
        @Index(name = "idx_user_email", columnList = "email", unique = true)
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class User extends BaseEntity {

    @Column(nullable = false, length = 120)
    private String name;

    @Column(nullable = false, unique = true, length = 120)
    private String email;

    @Column(length = 120)
    private String password;

    @Column(nullable = true, length = 10)
    private Long mobileNumber;

    @Column(name = "google_id", unique = true, length = 100)
    private String googleId;

    @Column(name = "email_verified", nullable = false)
    @Builder.Default
    private boolean emailVerified = false;

    @Column(name = "preferred_language", length = 20)
    @Builder.Default
    private String preferredLanguage = "en";

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    @Builder.Default
    private Role role = Role.CUSTOMER;

    @Column(nullable = false)
    @Builder.Default
    private boolean enabled = true;

    @Column(name = "last_login")
    private Instant lastLogin;

    @OneToMany(mappedBy = "user", cascade = jakarta.persistence.CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private List<Address> addresses = new ArrayList<>();

    public void addAddress(Address address) {
        address.setUser(this);
        this.addresses.add(address);
    }

    public void removeAddress(Address address) {
        this.addresses.remove(address);
        address.setUser(null);
    }
}
