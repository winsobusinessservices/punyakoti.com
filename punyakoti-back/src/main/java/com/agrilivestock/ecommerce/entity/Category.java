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
 * A product category (e.g. Cattle Feed, Poultry Supplements).
 */
@Entity
@Table(name = "categories")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Category extends BaseEntity {

    @Column(nullable = false, unique = true, length = 120)
    private String name;

    @Column(length = 1000)
    private String description;

    @Column(length = 500)
    private String image;

    @Column(nullable = false)
    @Builder.Default
    private boolean active = true;
}
