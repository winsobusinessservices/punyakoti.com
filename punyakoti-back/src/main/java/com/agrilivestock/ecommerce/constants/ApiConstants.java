package com.agrilivestock.ecommerce.constants;

/**
 * Centralized API-level constants to avoid magic strings scattered across the codebase.
 */
public final class ApiConstants {

    private ApiConstants() {
    }

    public static final String API_BASE = "/api/v1";

    // Auth
    public static final String AUTH_BASE = API_BASE + "/auth";

    // Public resources
    public static final String PRODUCTS_BASE = API_BASE + "/products";
    public static final String CATEGORIES_BASE = API_BASE + "/categories";
    public static final String FAQS_BASE = API_BASE + "/faqs";
    public static final String WHY_CHOOSE_US_BASE = API_BASE + "/why-choose-us";
    public static final String HOW_IT_WORKS_BASE = API_BASE + "/how-it-works";
    public static final String BANNERS_BASE = API_BASE + "/banners";
    public static final String REVIEWS_BASE = API_BASE + "/reviews";

    // Protected resources
    public static final String USERS_BASE = API_BASE + "/users";
    public static final String CART_BASE = API_BASE + "/cart";
    public static final String ORDERS_BASE = API_BASE + "/orders";
    public static final String ADDRESSES_BASE = API_BASE + "/addresses";

    // Admin
    public static final String ADMIN_BASE = API_BASE + "/admin";

    // Public media serving path (used by local media provider)
    public static final String MEDIA_BASE = "/media";

    // Pagination defaults
    public static final int DEFAULT_PAGE = 0;
    public static final int DEFAULT_PAGE_SIZE = 10;
    public static final int MAX_PAGE_SIZE = 100;
    public static final String DEFAULT_SORT_BY = "createdAt";
    public static final String DEFAULT_SORT_DIRECTION = "desc";
}
