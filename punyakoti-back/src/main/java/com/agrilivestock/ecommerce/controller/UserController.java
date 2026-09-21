package com.agrilivestock.ecommerce.controller;

import com.agrilivestock.ecommerce.dto.user.AddressDto;
import com.agrilivestock.ecommerce.dto.user.UserProfileRequest;
import com.agrilivestock.ecommerce.dto.user.UserResponse;
import com.agrilivestock.ecommerce.entity.User;
import com.agrilivestock.ecommerce.response.ApiResponse;
import com.agrilivestock.ecommerce.security.SecurityUtils;
import com.agrilivestock.ecommerce.service.UserService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/v1/users")
@RequiredArgsConstructor
@Tag(name = "User Profile", description = "User profile and address management APIs")
public class UserController {

    private final UserService userService;
    private final SecurityUtils securityUtils;

    @GetMapping("/profile")
    @Operation(summary = "Get current user profile")
    public ResponseEntity<ApiResponse<UserResponse>> getProfile() {
        User currentUser = securityUtils.getCurrentUser();
        UserResponse response = userService.getProfile(currentUser);
        return ResponseEntity.ok(ApiResponse.success("Profile retrieved successfully", response));
    }

    @PutMapping("/profile")
    @Operation(summary = "Update current user profile")
    public ResponseEntity<ApiResponse<UserResponse>> updateProfile(@Valid @RequestBody UserProfileRequest request) {
        User currentUser = securityUtils.getCurrentUser();
        UserResponse response = userService.updateProfile(currentUser, request);
        return ResponseEntity.ok(ApiResponse.success("Profile updated successfully", response));
    }

    @GetMapping("/addresses")
    @Operation(summary = "Get user delivery addresses")
    public ResponseEntity<ApiResponse<List<AddressDto>>> getAddresses() {
        User currentUser = securityUtils.getCurrentUser();
        List<AddressDto> addresses = userService.getAddresses(currentUser);
        return ResponseEntity.ok(ApiResponse.success("Addresses retrieved successfully", addresses));
    }

    @PostMapping("/addresses")
    @Operation(summary = "Add a new delivery address")
    public ResponseEntity<ApiResponse<AddressDto>> addAddress(@Valid @RequestBody AddressDto addressDto) {
        User currentUser = securityUtils.getCurrentUser();
        AddressDto saved = userService.addAddress(currentUser, addressDto);
        return ResponseEntity.ok(ApiResponse.success("Address added successfully", saved));
    }

    @PutMapping("/addresses/{id}")
    @Operation(summary = "Update an existing delivery address")
    public ResponseEntity<ApiResponse<AddressDto>> updateAddress(@PathVariable Long id, @Valid @RequestBody AddressDto addressDto) {
        User currentUser = securityUtils.getCurrentUser();
        AddressDto updated = userService.updateAddress(currentUser, id, addressDto);
        return ResponseEntity.ok(ApiResponse.success("Address updated successfully", updated));
    }

    @DeleteMapping("/addresses/{id}")
    @Operation(summary = "Delete a delivery address")
    public ResponseEntity<ApiResponse<Void>> deleteAddress(@PathVariable Long id) {
        User currentUser = securityUtils.getCurrentUser();
        userService.deleteAddress(currentUser, id);
        return ResponseEntity.ok(ApiResponse.success("Address deleted successfully"));
    }
}
