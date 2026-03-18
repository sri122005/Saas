package com.saas.multitenant.repository;

import com.saas.multitenant.model.Tenant;
import com.saas.multitenant.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByEmail(String email);
    List<User> findByTenant(Tenant tenant);
    boolean existsByEmail(String email);
}
