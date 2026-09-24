package com.agrilivestock.ecommerce.service.impl;

import com.agrilivestock.ecommerce.dto.user.AddressDto;
import com.agrilivestock.ecommerce.dto.user.UserProfileRequest;
import com.agrilivestock.ecommerce.dto.user.UserResponse;
import com.agrilivestock.ecommerce.entity.Address;
import com.agrilivestock.ecommerce.entity.User;
import com.agrilivestock.ecommerce.enums.Role;
import com.agrilivestock.ecommerce.exception.BadRequestException;
import com.agrilivestock.ecommerce.exception.ResourceNotFoundException;
import com.agrilivestock.ecommerce.mapper.UserMapper;
import com.agrilivestock.ecommerce.repository.AddressRepository;
import com.agrilivestock.ecommerce.repository.UserRepository;
import com.agrilivestock.ecommerce.response.PageResponse;
import com.agrilivestock.ecommerce.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;
    private final AddressRepository addressRepository;
    private final UserMapper userMapper;
    private final org.springframework.security.crypto.password.PasswordEncoder passwordEncoder;

    @Override
    public UserResponse getProfile(User currentUser) {
        return userMapper.toResponse(currentUser);
    }

    @Override
    @Transactional
    public UserResponse updateProfile(User currentUser, UserProfileRequest request) {
        User user = userRepository.findById(currentUser.getId())
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        user.setName(request.name());
        if (request.preferredLanguage() != null) {
            user.setPreferredLanguage(request.preferredLanguage());
        }
        if (request.mobileNumber() != null) {
            user.setMobileNumber(Long.parseLong(request.mobileNumber()));
        }
        return userMapper.toResponse(userRepository.save(user));
    }

    @Override
    @Transactional(readOnly = true)
    public List<AddressDto> getAddresses(User currentUser) {
        User user = userRepository.findByIdWithAddresses(currentUser.getId()).orElse(currentUser);
        return user.getAddresses().stream()
                .map(userMapper::toAddressDto)
                .toList();
    }

    @Override
    @Transactional
    public AddressDto addAddress(User currentUser, AddressDto addressDto) {
        User user = userRepository.findById(currentUser.getId())
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        Address address = userMapper.toAddressEntity(addressDto);
        address.setUser(user);

        if (addressDto.isDefault()) {
            user.getAddresses().forEach(a -> a.setDefault(false));
        }

        Address saved = addressRepository.save(address);
        return userMapper.toAddressDto(saved);
    }

    @Override
    @Transactional
    public AddressDto updateAddress(User currentUser, Long addressId, AddressDto addressDto) {
        Address address = addressRepository.findById(addressId)
                .orElseThrow(() -> new ResourceNotFoundException("Address not found"));

        if (!address.getUser().getId().equals(currentUser.getId())) {
            throw new ResourceNotFoundException("Address not found for current user");
        }

        address.setLine1(addressDto.line1());
        address.setLine2(addressDto.line2());
        address.setCity(addressDto.city());
        address.setState(addressDto.state());
        address.setPostalCode(addressDto.postalCode());
        if (addressDto.country() != null) {
            address.setCountry(addressDto.country());
        }

        if (addressDto.isDefault()) {
            User user = userRepository.findById(currentUser.getId()).orElse(currentUser);
            user.getAddresses().forEach(a -> a.setDefault(false));
            address.setDefault(true);
        }

        Address saved = addressRepository.save(address);
        return userMapper.toAddressDto(saved);
    }

    @Override
    @Transactional
    public void deleteAddress(User currentUser, Long addressId) {
        Address address = addressRepository.findById(addressId)
                .orElseThrow(() -> new ResourceNotFoundException("Address not found"));
        if (!address.getUser().getId().equals(currentUser.getId())) {
            throw new ResourceNotFoundException("Address not found for current user");
        }
        addressRepository.delete(address);
    }

    @Override
    public PageResponse<UserResponse> getAllUsers(Pageable pageable) {
        Page<User> page = userRepository.findAll(pageable);
        List<UserResponse> content = page.getContent().stream()
                .map(userMapper::toResponse)
                .toList();
        return PageResponse.of(page, content);
    }
    
    @Override
    @Transactional
    public UserResponse updateUserStatus(Long userId, boolean active) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        if (user.getRole().equals(Role.ADMIN)) {
            throw new BadRequestException("Admin account cannot be deleted");
        }
        user.setEnabled(active);
        return userMapper.toResponse(userRepository.save(user));
    }

    @Override
    @Transactional
    public UserResponse updateUserDetails(Long userId, com.agrilivestock.ecommerce.dto.user.AdminUpdateUserRequest request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        
        // Ensure email uniqueness if changed
        if (request.getEmail() != null && !request.getEmail().equals(user.getEmail())) {
            if (userRepository.existsByEmail(request.getEmail())) {
                throw new BadRequestException("Email already in use");
            }
            user.setEmail(request.getEmail());
        }

        if (request.getName() != null) {
            user.setName(request.getName());
        }
        
        if (request.getMobileNumber() != null) {
            user.setMobileNumber(request.getMobileNumber());
        }

        if (request.getPassword() != null && !request.getPassword().trim().isEmpty()) {
            user.setPassword(passwordEncoder.encode(request.getPassword()));
        }

        return userMapper.toResponse(userRepository.save(user));
    }
}
