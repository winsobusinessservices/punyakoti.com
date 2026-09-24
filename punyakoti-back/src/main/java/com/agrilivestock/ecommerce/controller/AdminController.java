package com.agrilivestock.ecommerce.controller;

import com.agrilivestock.ecommerce.dto.catalog.CategoryDto;
import com.agrilivestock.ecommerce.dto.catalog.ProductDto;
import com.agrilivestock.ecommerce.dto.catalog.ProductRequest;
import com.agrilivestock.ecommerce.dto.content.FAQDto;
import com.agrilivestock.ecommerce.dto.content.HowItWorksDto;
import com.agrilivestock.ecommerce.dto.content.WhyChooseUsDto;
import com.agrilivestock.ecommerce.dto.order.OrderResponse;
import com.agrilivestock.ecommerce.dto.order.OrderStatusRequest;
import com.agrilivestock.ecommerce.dto.review.ReviewResponse;
import com.agrilivestock.ecommerce.dto.user.UserResponse;
import com.agrilivestock.ecommerce.repository.OrderRepository;
import com.agrilivestock.ecommerce.repository.ProductRepository;
import com.agrilivestock.ecommerce.repository.ReviewRepository;
import com.agrilivestock.ecommerce.repository.UserRepository;
import com.agrilivestock.ecommerce.response.ApiResponse;
import com.agrilivestock.ecommerce.response.PageResponse;
import com.agrilivestock.ecommerce.service.CategoryService;
import com.agrilivestock.ecommerce.service.FAQService;
import com.agrilivestock.ecommerce.service.HowItWorksService;
import com.agrilivestock.ecommerce.service.MediaService;
import com.agrilivestock.ecommerce.service.OrderService;
import com.agrilivestock.ecommerce.service.ProductService;
import com.agrilivestock.ecommerce.service.ReviewService;
import com.agrilivestock.ecommerce.service.UserService;
import com.agrilivestock.ecommerce.service.WhyChooseUsService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import java.util.Map;

@RestController
@RequestMapping("/api/v1/admin")
@PreAuthorize("hasRole('ADMIN')")
@RequiredArgsConstructor
@Tag(name = "Admin Operations", description = "Administrative dashboard, product management, order processing, and content moderation APIs")
public class AdminController {

    private final ProductService productService;
    private final CategoryService categoryService;
    private final OrderService orderService;
    private final com.agrilivestock.ecommerce.service.CartService cartService;
    private final ReviewService reviewService;
    private final UserService userService;
    private final FAQService faqService;
    private final WhyChooseUsService whyChooseUsService;
    private final HowItWorksService howItWorksService;
    private final MediaService mediaService;

    private final UserRepository userRepository;
    private final ProductRepository productRepository;
    private final OrderRepository orderRepository;
    private final ReviewRepository reviewRepository;

    // --- Dashboard Summary ---
    @GetMapping("/dashboard/stats")
    @Operation(summary = "Get admin dashboard overview metrics")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getDashboardMetrics() {
        long totalUsers = userRepository.count();
        long totalProducts = productRepository.count();
        long totalOrders = orderRepository.count();
        long pendingReviews = reviewRepository.findAll().stream().filter(r -> !r.isApproved()).count();

        java.time.Instant now = java.time.Instant.now();
        java.time.ZoneId zone = java.time.ZoneId.of("Asia/Kolkata");
        
        // Today
        java.time.ZonedDateTime startOfDay = now.atZone(zone).truncatedTo(java.time.temporal.ChronoUnit.DAYS);
        java.time.ZonedDateTime startOfTomorrow = startOfDay.plusDays(1);
        
        // This Week
        java.time.ZonedDateTime startOfWeek = startOfDay.with(java.time.temporal.TemporalAdjusters.previousOrSame(java.time.DayOfWeek.MONDAY));
        
        // This Month
        java.time.ZonedDateTime startOfMonth = startOfDay.withDayOfMonth(1);
        
        java.math.BigDecimal dailySales = orderRepository.sumRevenueByDateRange(startOfDay.toInstant(), startOfTomorrow.toInstant());
        java.math.BigDecimal weeklySales = orderRepository.sumRevenueByDateRange(startOfWeek.toInstant(), startOfTomorrow.toInstant());
        java.math.BigDecimal monthlySales = orderRepository.sumRevenueByDateRange(startOfMonth.toInstant(), startOfTomorrow.toInstant());
        java.math.BigDecimal totalSales = orderRepository.sumRevenue();

        // Calculate sales trend for the last 7 months
        java.util.List<Map<String, Object>> salesTrend = new java.util.ArrayList<>();
        for (int i = 6; i >= 0; i--) {
            java.time.ZonedDateTime monthStart = startOfMonth.minusMonths(i);
            java.time.ZonedDateTime nextMonthStart = monthStart.plusMonths(1);
            
            java.math.BigDecimal rev = orderRepository.sumRevenueByDateRange(monthStart.toInstant(), nextMonthStart.toInstant());
            
            salesTrend.add(Map.of(
                "month", monthStart.format(java.time.format.DateTimeFormatter.ofPattern("MMM")),
                "revenue", rev
            ));
        }

        Map<String, Object> metrics = Map.of(
                "totalUsers", totalUsers,
                "totalProducts", totalProducts,
                "totalOrders", totalOrders,
                "pendingReviews", pendingReviews,
                "dailySales", dailySales,
                "weeklySales", weeklySales,
                "monthlySales", monthlySales,
                "totalSales", totalSales,
                "salesTrend", salesTrend
        );

        return ResponseEntity.ok(ApiResponse.success("Dashboard metrics loaded", metrics));
    }

    // --- Media Upload ---
    @PostMapping(value = "/media/upload", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @Operation(summary = "Upload image/video file to storage provider")
    public ResponseEntity<ApiResponse<Map<String, String>>> uploadMedia(
            @RequestPart("file") MultipartFile file,
            @RequestParam(defaultValue = "products") String folder
    ) {
        String url = mediaService.uploadFile(file, folder);
        return ResponseEntity.ok(ApiResponse.success("File uploaded successfully", Map.of("url", url)));
    }

    // --- Product Management ---
    @GetMapping("/products")
    @Operation(summary = "Get all products (Admin)")
    public ResponseEntity<ApiResponse<PageResponse<ProductDto>>> getAllProducts(
            @RequestParam(required = false) String search,
            @RequestParam(required = false) Long categoryId,
            @RequestParam(required = false) java.math.BigDecimal minPrice,
            @RequestParam(required = false) java.math.BigDecimal maxPrice,
            @RequestParam(required = false) String weight,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "50") int size,
            @RequestParam(defaultValue = "id,desc") String[] sort
    ) {
        org.springframework.data.domain.Sort.Direction direction = sort.length > 1 && sort[1].equalsIgnoreCase("asc") ? org.springframework.data.domain.Sort.Direction.ASC : org.springframework.data.domain.Sort.Direction.DESC;
        org.springframework.data.domain.Pageable pageable = org.springframework.data.domain.PageRequest.of(page, size, org.springframework.data.domain.Sort.by(direction, sort[0]));
        PageResponse<ProductDto> result = productService.getAllProductsAdmin(search, categoryId, minPrice, maxPrice, weight, pageable);
        return ResponseEntity.ok(ApiResponse.success("Products retrieved successfully", result));
    }
    @PostMapping(value = "/products", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @Operation(summary = "Create a new product")
    public ResponseEntity<ApiResponse<ProductDto>> createProduct(
            @RequestPart("data") @Valid ProductRequest request,
            @RequestPart(value = "files", required = false) java.util.List<MultipartFile> files) {
        
        // Handling file uploads in a simplified way here. The actual robust implementation
        // might associate files to media dtos.
        if (files != null && !files.isEmpty()) {
            java.util.List<com.agrilivestock.ecommerce.dto.catalog.ProductMediaDto> mediaList = new java.util.ArrayList<>();
            for (MultipartFile file : files) {
                if (!file.isEmpty()) {
                    String url = mediaService.uploadFile(file, "products");
                    mediaList.add(new com.agrilivestock.ecommerce.dto.catalog.ProductMediaDto(
                            null, 
                            com.agrilivestock.ecommerce.enums.MediaType.IMAGE, 
                            url, 
                            mediaList.size() + 1, 
                            mediaList.isEmpty()
                    ));
                }
            }
            if (!mediaList.isEmpty()) {
                request = new ProductRequest(request.name(), request.shortDescription(), request.description(), request.benefits(), request.ingredients(), request.usageInstructions(), request.categoryId(), request.active(), request.variants(), mediaList);
            }
        }

        ProductDto created = productService.createProduct(request);
        return ResponseEntity.ok(ApiResponse.success("Product created successfully", created));
    }

    @PutMapping(value = "/products/{id}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @Operation(summary = "Update an existing product")
    public ResponseEntity<ApiResponse<ProductDto>> updateProduct(
            @PathVariable Long id, 
            @RequestPart("data") @Valid ProductRequest request,
            @RequestPart(value = "files", required = false) java.util.List<MultipartFile> files) {
        
        if (files != null && !files.isEmpty()) {
            java.util.List<com.agrilivestock.ecommerce.dto.catalog.ProductMediaDto> mediaList = new java.util.ArrayList<>(request.media() != null ? request.media() : java.util.List.of());
            for (MultipartFile file : files) {
                if (!file.isEmpty()) {
                    String url = mediaService.uploadFile(file, "products");
                    mediaList.add(new com.agrilivestock.ecommerce.dto.catalog.ProductMediaDto(
                            null, 
                            com.agrilivestock.ecommerce.enums.MediaType.IMAGE, 
                            url, 
                            mediaList.size() + 1, 
                            mediaList.isEmpty()
                    ));
                }
            }
            request = new ProductRequest(request.name(), request.shortDescription(), request.description(), request.benefits(), request.ingredients(), request.usageInstructions(), request.categoryId(), request.active(), request.variants(), mediaList);
        }

        ProductDto updated = productService.updateProduct(id, request);
        return ResponseEntity.ok(ApiResponse.success("Product updated successfully", updated));
    }

    @DeleteMapping("/products/{id}")
    @Operation(summary = "Delete a product")
    public ResponseEntity<ApiResponse<Void>> deleteProduct(@PathVariable Long id) {
        productService.deleteProduct(id);
        return ResponseEntity.ok(ApiResponse.success("Product deleted successfully"));
    }

    // --- Category Management ---
    @PostMapping(value = "/categories", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @Operation(summary = "Create a new category")
    public ResponseEntity<ApiResponse<CategoryDto>> createCategory(
            @RequestPart("data") @Valid CategoryDto dto,
            @RequestPart(value = "image", required = false) MultipartFile image) {
        if (image != null && !image.isEmpty()) {
            String url = mediaService.uploadFile(image, "categories");
            dto = new CategoryDto(dto.id(), dto.name(), dto.description(), url);
        }
        CategoryDto created = categoryService.createCategory(dto);
        return ResponseEntity.ok(ApiResponse.success("Category created successfully", created));
    }

    @PutMapping(value = "/categories/{id}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @Operation(summary = "Update a category")
    public ResponseEntity<ApiResponse<CategoryDto>> updateCategory(
            @PathVariable Long id, 
            @RequestPart("data") @Valid CategoryDto dto,
            @RequestPart(value = "image", required = false) MultipartFile image) {
        if (image != null && !image.isEmpty()) {
            String url = mediaService.uploadFile(image, "categories");
            dto = new CategoryDto(dto.id(), dto.name(), dto.description(), url);
        }
        CategoryDto updated = categoryService.updateCategory(id, dto);
        return ResponseEntity.ok(ApiResponse.success("Category updated successfully", updated));
    }

    @DeleteMapping("/categories/{id}")
    @Operation(summary = "Delete a category")
    public ResponseEntity<ApiResponse<Void>> deleteCategory(@PathVariable Long id) {
        categoryService.deleteCategory(id);
        return ResponseEntity.ok(ApiResponse.success("Category deleted successfully"));
    }

    // --- Order Management ---
    @GetMapping("/orders")
    @Operation(summary = "Get all customer orders (Admin)")
    public ResponseEntity<ApiResponse<PageResponse<OrderResponse>>> getAllOrders(
            @RequestParam(required = false) String search,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    ) {
        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "createdAt"));
        PageResponse<OrderResponse> orders = orderService.getAllOrdersAdmin(search, pageable);
        return ResponseEntity.ok(ApiResponse.success("All orders retrieved successfully", orders));
    }

    @PutMapping("/orders/{id}/status")
    @Operation(summary = "Update order fulfillment status")
    public ResponseEntity<ApiResponse<OrderResponse>> updateOrderStatus(@PathVariable Long id, @Valid @RequestBody OrderStatusRequest request) {
        OrderResponse updated = orderService.updateOrderStatusAdmin(id, request);
        return ResponseEntity.ok(ApiResponse.success("Order status updated successfully", updated));
    }

    @GetMapping("/carts")
    @Operation(summary = "Get all abandoned carts (Admin)")
    public ResponseEntity<ApiResponse<PageResponse<com.agrilivestock.ecommerce.dto.cart.AdminCartDto>>> getAbandonedCarts(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    ) {
        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "updatedAt"));
        PageResponse<com.agrilivestock.ecommerce.dto.cart.AdminCartDto> carts = cartService.getAllAbandonedCarts(pageable);
        return ResponseEntity.ok(ApiResponse.success("Abandoned carts retrieved successfully", carts));
    }

    // --- Review Moderation ---
    @GetMapping("/reviews")
    @Operation(summary = "Get all product reviews (Admin moderation)")
    public ResponseEntity<ApiResponse<PageResponse<ReviewResponse>>> getAllReviews(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    ) {
        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "createdAt"));
        PageResponse<ReviewResponse> reviews = reviewService.getAllReviewsAdmin(pageable);
        return ResponseEntity.ok(ApiResponse.success("Reviews retrieved for moderation", reviews));
    }

    @PutMapping("/reviews/{id}/approve")
    @Operation(summary = "Approve customer review")
    public ResponseEntity<ApiResponse<ReviewResponse>> approveReview(@PathVariable Long id) {
        ReviewResponse approved = reviewService.approveReviewAdmin(id);
        return ResponseEntity.ok(ApiResponse.success("Review approved successfully", approved));
    }

    @DeleteMapping("/reviews/{id}")
    @Operation(summary = "Delete review")
    public ResponseEntity<ApiResponse<Void>> deleteReview(@PathVariable Long id) {
        reviewService.deleteReviewAdmin(id);
        return ResponseEntity.ok(ApiResponse.success("Review deleted successfully"));
    }

    // --- User Administration ---
    @GetMapping("/users")
    @Operation(summary = "Get all platform users")
    public ResponseEntity<ApiResponse<PageResponse<UserResponse>>> getAllUsers(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    ) {
        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "createdAt"));
        PageResponse<UserResponse> users = userService.getAllUsers(pageable);
        return ResponseEntity.ok(ApiResponse.success("Users retrieved successfully", users));
    }

    @PutMapping("/users/{id}/status")
    @Operation(summary = "Update user active/suspended status")
    public ResponseEntity<ApiResponse<UserResponse>> updateUserStatus(@PathVariable Long id, @RequestBody Map<String, Boolean> body) {
        Boolean active = body.get("active");
        if (active == null) active = true;
        UserResponse updated = userService.updateUserStatus(id, active);
        return ResponseEntity.ok(ApiResponse.success("User status updated", updated));
    }

    @PutMapping("/users/{id}")
    @Operation(summary = "Update user details by admin")
    public ResponseEntity<ApiResponse<UserResponse>> updateUserDetails(
            @PathVariable Long id,
            @RequestBody @Valid com.agrilivestock.ecommerce.dto.user.AdminUpdateUserRequest request) {
        UserResponse response = userService.updateUserDetails(id, request);
        return ResponseEntity.ok(ApiResponse.success("User details updated successfully", response));
    }

    // --- Content CRUD (FAQ, Why Choose Us, How It Works, Banner) ---
    @PostMapping("/faqs")
    public ResponseEntity<ApiResponse<FAQDto>> createFaq(@Valid @RequestBody FAQDto dto) {
        return ResponseEntity.ok(ApiResponse.success("FAQ created", faqService.createFaq(dto)));
    }

    @PutMapping("/faqs/{id}")
    public ResponseEntity<ApiResponse<FAQDto>> updateFaq(@PathVariable Long id, @Valid @RequestBody FAQDto dto) {
        return ResponseEntity.ok(ApiResponse.success("FAQ updated", faqService.updateFaq(id, dto)));
    }

    @DeleteMapping("/faqs/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteFaq(@PathVariable Long id) {
        faqService.deleteFaq(id);
        return ResponseEntity.ok(ApiResponse.success("FAQ deleted"));
    }

    @PostMapping(value = "/why-choose-us", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<ApiResponse<WhyChooseUsDto>> createWhyChooseUs(
            @RequestPart("data") @Valid WhyChooseUsDto dto,
            @RequestPart(value = "image", required = false) MultipartFile image) {
        if (image != null && !image.isEmpty()) {
            String url = mediaService.uploadFile(image, "content");
            dto = new WhyChooseUsDto(dto.id(), dto.title(), dto.description(), url);
        }
        return ResponseEntity.ok(ApiResponse.success("Item created", whyChooseUsService.create(dto)));
    }

    @PutMapping(value = "/why-choose-us/{id}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<ApiResponse<WhyChooseUsDto>> updateWhyChooseUs(
            @PathVariable Long id, 
            @RequestPart("data") @Valid WhyChooseUsDto dto,
            @RequestPart(value = "image", required = false) MultipartFile image) {
        if (image != null && !image.isEmpty()) {
            String url = mediaService.uploadFile(image, "content");
            dto = new WhyChooseUsDto(dto.id(), dto.title(), dto.description(), url);
        }
        return ResponseEntity.ok(ApiResponse.success("Item updated", whyChooseUsService.update(id, dto)));
    }

    @DeleteMapping("/why-choose-us/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteWhyChooseUs(@PathVariable Long id) {
        whyChooseUsService.delete(id);
        return ResponseEntity.ok(ApiResponse.success("Item deleted"));
    }

    @PostMapping("/how-it-works")
    public ResponseEntity<ApiResponse<HowItWorksDto>> createHowItWorks(@Valid @RequestBody HowItWorksDto dto) {
        return ResponseEntity.ok(ApiResponse.success("Item created", howItWorksService.create(dto)));
    }

    @PutMapping("/how-it-works/{id}")
    public ResponseEntity<ApiResponse<HowItWorksDto>> updateHowItWorks(
            @PathVariable Long id, 
            @Valid @RequestBody HowItWorksDto dto) {
        return ResponseEntity.ok(ApiResponse.success("Item updated", howItWorksService.update(id, dto)));
    }

    @DeleteMapping("/how-it-works/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteHowItWorks(@PathVariable Long id) {
        howItWorksService.delete(id);
        return ResponseEntity.ok(ApiResponse.success("Item deleted"));
    }
}
