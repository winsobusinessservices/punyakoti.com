package com.agrilivestock.ecommerce.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/**
 * A "Why Choose Us" highlight shown on the storefront.
 */
@Entity
@Table(name = "why_choose_us")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class WhyChooseUs extends BaseEntity {

    @Column(nullable = false, length = 200)
    private String title;

    @Column(nullable = false, length = 1000)
    private String description;

    @Column(length = 500)
    private String icon;

    @Column(name = "display_order", nullable = false)
    @Builder.Default
    private Integer displayOrder = 0;

    @Column(nullable = false)
    @Builder.Default
    private boolean active = true;
}
