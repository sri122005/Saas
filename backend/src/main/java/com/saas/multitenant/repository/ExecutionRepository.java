package com.saas.multitenant.repository;

import com.saas.multitenant.model.ExecutionEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.UUID;

@Repository
public interface ExecutionRepository extends JpaRepository<ExecutionEntity, UUID> {
}
