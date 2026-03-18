package com.saas.multitenant.repository;

import com.saas.multitenant.model.WorkflowLog;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.UUID;

@Repository
public interface WorkflowLogRepository extends JpaRepository<WorkflowLog, UUID> {
    List<WorkflowLog> findByExecutionIdOrderByStartedAtAsc(UUID executionId);
}
