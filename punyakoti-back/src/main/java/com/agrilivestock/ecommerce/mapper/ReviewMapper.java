package com.agrilivestock.ecommerce.mapper;

import com.agrilivestock.ecommerce.dto.review.ReviewResponse;
import com.agrilivestock.ecommerce.entity.Review;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface ReviewMapper {

    @Mapping(target = "productId", source = "product.id")
    @Mapping(target = "userName", source = "user.name")
    @Mapping(target = "userMobile", source = "user.mobileNumber")
    ReviewResponse toResponse(Review review);
}
