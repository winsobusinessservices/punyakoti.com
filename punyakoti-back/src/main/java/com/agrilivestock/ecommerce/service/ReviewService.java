package com.agrilivestock.ecommerce.service;

import com.agrilivestock.ecommerce.dto.review.ReviewRequest;
import com.agrilivestock.ecommerce.dto.review.ReviewResponse;
import com.agrilivestock.ecommerce.entity.User;
import com.agrilivestock.ecommerce.response.PageResponse;
import org.springframework.data.domain.Pageable;

import java.util.List;

public interface ReviewService {
    ReviewResponse createReview(User currentUser, ReviewRequest request);
    List<ReviewResponse> getApprovedProductReviews(Long productId);
    PageResponse<ReviewResponse> getAllReviewsAdmin(Pageable pageable);
    ReviewResponse approveReviewAdmin(Long reviewId);
    void deleteReviewAdmin(Long reviewId);
    PageResponse<ReviewResponse> getAllReviews(Pageable pageable);
}
