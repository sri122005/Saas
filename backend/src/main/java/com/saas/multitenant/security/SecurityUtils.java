package com.saas.multitenant.security;

import com.saas.multitenant.exception.ResourceNotFoundException;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;

public class SecurityUtils {

    public static CustomUserDetails getCurrentUserDetails() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication != null && authentication.getPrincipal() instanceof CustomUserDetails) {
            return (CustomUserDetails) authentication.getPrincipal();
        }
        throw new ResourceNotFoundException("Authentication not found or invalid.");
    }

    public static Long getCurrentTenantId() {
        return getCurrentUserDetails().getTenantId();
    }
}
