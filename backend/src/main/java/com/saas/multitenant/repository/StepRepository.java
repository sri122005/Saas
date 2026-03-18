package com.saas.multitenant.repository;

import com.saas.multitenant.model.StepEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.UUID;

@Repository
public interface StepRepository extends JpaRepository<StepEntity, UUID> {
    List<StepEntity> findByWorkflowIdOrderByOrderAsc(UUID workflowId);
}
