package com.saas.multitenant.controller;

import com.saas.multitenant.model.ExecutionEntity;
import com.saas.multitenant.model.StepEntity;
import com.saas.multitenant.model.WorkflowEntity;
import com.saas.multitenant.repository.ExecutionRepository;
import com.saas.multitenant.repository.StepRepository;
import com.saas.multitenant.repository.WorkflowRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Sort;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/audit-logs")
@RequiredArgsConstructor
public class AuditLogController {

    private final ExecutionRepository executionRepository;
    private final WorkflowRepository workflowRepository;
    private final StepRepository stepRepository;

    @GetMapping
    public List<ExecutionEntity> getAllAuditLogs() {
        List<ExecutionEntity> executions = executionRepository.findAll(
                Sort.by(Sort.Direction.DESC, "startedAt"));

        // Enrich with workflow name and step name
        for (ExecutionEntity exec : executions) {
            if (exec.getWorkflowId() != null) {
                workflowRepository.findById(exec.getWorkflowId())
                        .map(WorkflowEntity::getName)
                        .ifPresent(exec::setWorkflowName);
            }
            if (exec.getCurrentStepId() != null) {
                stepRepository.findById(exec.getCurrentStepId())
                        .map(StepEntity::getName)
                        .ifPresent(exec::setCurrentStepName);
            }
        }
        return executions;
    }
}
