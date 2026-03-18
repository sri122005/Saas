package com.saas.multitenant.repository;

import com.saas.multitenant.model.RuleEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.UUID;

@Repository
public interface RuleRepository extends JpaRepository<RuleEntity, UUID> {
    List<RuleEntity> findByStepIdOrderByPriorityAsc(UUID stepId);
}
