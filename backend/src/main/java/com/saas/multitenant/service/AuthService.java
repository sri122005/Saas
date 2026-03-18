package com.saas.multitenant.service;

import com.saas.multitenant.dto.AuthRequest;
import com.saas.multitenant.dto.AuthResponse;
import com.saas.multitenant.dto.RegisterRequest;
import com.saas.multitenant.dto.UserDto;
import com.saas.multitenant.exception.ResourceNotFoundException;
import com.saas.multitenant.model.Role;
import com.saas.multitenant.model.Tenant;
import com.saas.multitenant.model.User;
import com.saas.multitenant.repository.TenantRepository;
import com.saas.multitenant.repository.UserRepository;
import com.saas.multitenant.security.CustomUserDetails;
import com.saas.multitenant.security.JwtUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final TenantRepository tenantRepository;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;
    private final AuthenticationManager authenticationManager;

    @Transactional
    public AuthResponse registerTenant(RegisterRequest request) {
        if (userRepository.existsByEmail(request.getAdminEmail())) {
            throw new IllegalArgumentException("Email is already in use.");
        }
        if (tenantRepository.findByName(request.getTenantName()).isPresent()) {
            throw new IllegalArgumentException("Tenant name is already in use.");
        }

        // Create Tenant
        Tenant tenant = Tenant.builder()
                .name(request.getTenantName())
                .build();
        @SuppressWarnings("null")
        Tenant savedTenant = tenantRepository.save(tenant);
        tenant = savedTenant;

        // Create Admin User
        User admin = User.builder()
                .name(request.getAdminName())
                .email(request.getAdminEmail())
                .password(passwordEncoder.encode(request.getAdminPassword()))
                .role(Role.ADMIN)
                .tenant(tenant)
                .build();
        @SuppressWarnings("null")
        User savedAdmin = userRepository.save(admin);
        admin = savedAdmin;

        String jwtToken = jwtUtil.generateToken(new CustomUserDetails(admin));

        return AuthResponse.builder()
                .token(jwtToken)
                .user(mapToDto(admin))
                .build();
    }

    public AuthResponse login(AuthRequest request) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.getEmail(),
                        request.getPassword()
                )
        );

        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new ResourceNotFoundException("User not found."));

        String jwtToken = jwtUtil.generateToken(new CustomUserDetails(user));

        return AuthResponse.builder()
                .token(jwtToken)
                .user(mapToDto(user))
                .build();
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
