package com.saas.multitenant.repository;

import com.saas.multitenant.model.Project;
import com.saas.multitenant.model.Tenant;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ProjectRepository extends JpaRepository<Project, Long> {
    List<Project> findByTenant(Tenant tenant);
}
