package com.agrilivestock.ecommerce.enums;

import java.util.Set;

/**
 * Lifecycle states of an order along with the legal transitions between them.
 */
public enum OrderStatus {
    PENDING,
    CONFIRMED,
    PACKED,
    SHIPPED,
    DELIVERED,
    CANCELLED;

    /**
     * Returns the set of statuses this status is allowed to transition into.
     */
    public Set<OrderStatus> allowedTransitions() {
        return switch (this) {
            case PENDING -> Set.of(CONFIRMED, CANCELLED);
            case CONFIRMED -> Set.of(PACKED, CANCELLED);
            case PACKED -> Set.of(SHIPPED, CANCELLED);
            case SHIPPED -> Set.of(DELIVERED);
            case DELIVERED, CANCELLED -> Set.of();
        };
    }

    public boolean canTransitionTo(OrderStatus target) {
        return allowedTransitions().contains(target);
    }
}
