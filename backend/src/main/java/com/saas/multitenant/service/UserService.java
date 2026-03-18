package com.saas.multitenant.service;

import com.saas.multitenant.dto.UserDto;
import com.saas.multitenant.dto.UserRequest;
import com.saas.multitenant.exception.ResourceNotFoundException;
import com.saas.multitenant.model.Role;
import com.saas.multitenant.model.Tenant;
import com.saas.multitenant.model.User;
import com.saas.multitenant.repository.TenantRepository;
import com.saas.multitenant.repository.UserRepository;
import com.saas.multitenant.security.SecurityUtils;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final TenantRepository tenantRepository;
    private final PasswordEncoder passwordEncoder;

    public UserDto createUser(UserRequest request) {
        Long tenantId = java.util.Objects.requireNonNull(SecurityUtils.getCurrentTenantId());
        Tenant tenant = tenantRepository.findById(tenantId)
                .orElseThrow(() -> new ResourceNotFoundException("Tenant not found"));

        if (userRepository.existsByEmail(request.getEmail())) {
            throw new IllegalArgumentException("Email is already in use.");
        }

        Role role = Role.USER;
        if (request.getRole() != null && request.getRole().equalsIgnoreCase("ADMIN")) {
            // Option to restrict ADMIN creation could be added here
            role = Role.ADMIN;
        }

        User user = User.builder()
                .name(request.getName())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .role(role)
                .tenant(tenant)
                .build();

        @SuppressWarnings("null")
        User savedUser = userRepository.save(user);
        user = savedUser;

        return mapToDto(user);
    }

    public List<UserDto> getAllUsersForCurrentTenant() {
        Long tenantId = SecurityUtils.getCurrentTenantId();
        Tenant tenant = tenantRepository.findById(tenantId)
                .orElseThrow(() -> new ResourceNotFoundException("Tenant not found"));

        return userRepository.findByTenant(tenant).stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    private UserDto mapToDto(User user) {
        return UserDto.builder()
                .id(user.getId())
                .name(user.getName())
                .email(user.getEmail())
                .role(user.getRole().name())
                .tenantId(user.getTenant().getId())
                .createdAt(user.getCreatedAt())
                .build();
    }
}
