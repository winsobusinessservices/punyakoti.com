package com.agrilivestock.ecommerce.service.impl;

import com.agrilivestock.ecommerce.dto.review.ReviewRequest;
import com.agrilivestock.ecommerce.dto.review.ReviewResponse;
import com.agrilivestock.ecommerce.entity.Product;
import com.agrilivestock.ecommerce.entity.Review;
import com.agrilivestock.ecommerce.entity.User;
import com.agrilivestock.ecommerce.exception.ResourceNotFoundException;
import com.agrilivestock.ecommerce.mapper.ReviewMapper;
import com.agrilivestock.ecommerce.repository.ProductRepository;
import com.agrilivestock.ecommerce.repository.ReviewRepository;
import com.agrilivestock.ecommerce.response.PageResponse;
import com.agrilivestock.ecommerce.service.ReviewService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class ReviewServiceImpl implements ReviewService {

    private final ReviewRepository reviewRepository;
    private final ProductRepository productRepository;
    private final ReviewMapper reviewMapper;

    @Override
    @Transactional
    public ReviewResponse createReview(User currentUser, ReviewRequest request) {
        Product product = productRepository.findById(request.productId())
                .orElseThrow(() -> new ResourceNotFoundException("Product not found"));

        Review review = Review.builder()
                .product(product)
                .user(currentUser)
                .rating(request.rating())
                .comment(request.comment())
                .videoUrl(request.videoUrl())
                .approved(false) // Requires admin approval by default
                .build();

        return reviewMapper.toResponse(reviewRepository.save(review));
    }

    @Override
    public List<ReviewResponse> getApprovedProductReviews(Long productId) {
        return reviewRepository.findByProductIdAndApprovedTrue(productId).stream()
                .map(reviewMapper::toResponse)
                .toList();
    }

    @Override
    public PageResponse<ReviewResponse> getAllReviewsAdmin(Pageable pageable) {
        Page<Review> page = reviewRepository.findAll(pageable);
        List<ReviewResponse> content = page.getContent().stream()
                .map(reviewMapper::toResponse)
                .toList();
        return PageResponse.of(page, content);
    }

    @Override
    @Transactional
    public ReviewResponse approveReviewAdmin(Long reviewId) {
        Review review = reviewRepository.findById(reviewId)
                .orElseThrow(() -> new ResourceNotFoundException("Review not found with id: " + reviewId));
        review.setApproved(true);
        return reviewMapper.toResponse(reviewRepository.save(review));
    }

    @Override
    @Transactional
    public void deleteReviewAdmin(Long reviewId) {
        if (!reviewRepository.existsById(reviewId)) {
            throw new ResourceNotFoundException("Review not found with id: " + reviewId);
        }
        reviewRepository.deleteById(reviewId);
    }

    @Override
    public PageResponse<ReviewResponse> getAllReviews(Pageable pageable) {
        Page<Review> page = reviewRepository.findByApprovedTrue(pageable);
        List<ReviewResponse> content = page.getContent().stream()
                .map(reviewMapper::toResponse)
                .toList();
        return PageResponse.of(page, content);
    }
}
