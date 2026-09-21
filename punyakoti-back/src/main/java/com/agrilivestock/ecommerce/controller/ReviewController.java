package com.agrilivestock.ecommerce.controller;

import com.agrilivestock.ecommerce.dto.review.ReviewRequest;
import com.agrilivestock.ecommerce.dto.review.ReviewResponse;
import com.agrilivestock.ecommerce.entity.User;
import com.agrilivestock.ecommerce.response.ApiResponse;
import com.agrilivestock.ecommerce.response.PageResponse;
import com.agrilivestock.ecommerce.security.SecurityUtils;
import com.agrilivestock.ecommerce.service.ReviewService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.http.MediaType;
import org.springframework.web.multipart.MultipartFile;
import com.agrilivestock.ecommerce.service.MediaService;

import java.util.List;

@RestController
@RequestMapping("/api/v1/reviews")
@RequiredArgsConstructor
@Tag(name = "Product Reviews", description = "Product review creation and retrieval APIs")
public class ReviewController {

    private final ReviewService reviewService;
    private final SecurityUtils securityUtils;
    private final MediaService mediaService;

    @GetMapping("/product/{productId}")
    @Operation(summary = "Get approved reviews for a product")
    public ResponseEntity<ApiResponse<List<ReviewResponse>>> getApprovedProductReviews(@PathVariable Long productId) {
        List<ReviewResponse> reviews = reviewService.getApprovedProductReviews(productId);
        return ResponseEntity.ok(ApiResponse.success("Reviews retrieved successfully", reviews));
    }

    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @Operation(summary = "Post a review for a product (requires approval)")
    public ResponseEntity<ApiResponse<ReviewResponse>> createReview(
            @RequestPart("data") @Valid ReviewRequest request,
            @RequestPart(value = "video", required = false) MultipartFile video) {
        
        if (video != null && !video.isEmpty()) {
            String videoUrl = mediaService.uploadFile(video, "reviews");
            request = new ReviewRequest(request.productId(), request.rating(), request.comment(), videoUrl);
        }

        User currentUser = securityUtils.getCurrentUser();
        ReviewResponse review = reviewService.createReview(currentUser, request);
        return ResponseEntity.ok(ApiResponse.success("Review submitted for approval successfully", review));
    }

    @GetMapping
    @Operation(summary = "Get all approved reviews for a product")
    public ResponseEntity<ApiResponse<PageResponse<ReviewResponse>>> getAllReviews(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    ) {
        Pageable pageable = PageRequest.of(
                page,
                size,
                Sort.by(
                        Sort.Order.desc( "rating"),
                        Sort.Order.desc("createdAt")
                )
        );
        PageResponse<ReviewResponse> reviews = reviewService.getAllReviews(pageable);
        return ResponseEntity.ok(ApiResponse.success("Reviews retrieved successfully", reviews));
    }
}
