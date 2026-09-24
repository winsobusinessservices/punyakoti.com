package com.agrilivestock.ecommerce.service;

import com.agrilivestock.ecommerce.dto.user.AddressDto;
import com.agrilivestock.ecommerce.dto.user.UserProfileRequest;
import com.agrilivestock.ecommerce.dto.user.UserResponse;
import com.agrilivestock.ecommerce.entity.User;
import com.agrilivestock.ecommerce.response.PageResponse;
import org.springframework.data.domain.Pageable;

import java.util.List;

public interface UserService {
    UserResponse getProfile(User currentUser);
    UserResponse updateProfile(User currentUser, UserProfileRequest request);
    List<AddressDto> getAddresses(User currentUser);
    AddressDto addAddress(User currentUser, AddressDto addressDto);
    AddressDto updateAddress(User currentUser, Long addressId, AddressDto addressDto);
    void deleteAddress(User currentUser, Long addressId);
    PageResponse<UserResponse> getAllUsers(Pageable pageable);
    UserResponse updateUserStatus(Long userId, boolean active);
    UserResponse updateUserDetails(Long userId, com.agrilivestock.ecommerce.dto.user.AdminUpdateUserRequest request);
}
