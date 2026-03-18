package com.saas.multitenant.repository;

import com.saas.multitenant.model.ExecutionLogEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.UUID;

@Repository
public interface ExecutionLogRepository extends JpaRepository<ExecutionLogEntity, UUID> {
    List<ExecutionLogEntity> findByExecutionIdOrderByStartedAtAsc(UUID executionId);
}
