package com.saas.multitenant.repository;

import com.saas.multitenant.model.Tenant;
import com.saas.multitenant.model.WorkflowEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface WorkflowRepository extends JpaRepository<WorkflowEntity, UUID> {
    List<WorkflowEntity> findByTenant(Tenant tenant);
}
