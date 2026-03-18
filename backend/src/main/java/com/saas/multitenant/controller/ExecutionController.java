package com.saas.multitenant.controller;

import com.saas.multitenant.model.ExecutionEntity;
import com.saas.multitenant.model.ExecutionLogEntity;
import com.saas.multitenant.model.StepEntity;
import com.saas.multitenant.model.WorkflowEntity;
import com.saas.multitenant.repository.ExecutionLogRepository;
import com.saas.multitenant.repository.ExecutionRepository;
import com.saas.multitenant.repository.StepRepository;
import com.saas.multitenant.repository.WorkflowRepository;
import com.saas.multitenant.service.ExecutionService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/executions")
@RequiredArgsConstructor
public class ExecutionController {

    private final ExecutionService executionService;
    private final ExecutionRepository executionRepository;
    private final ExecutionLogRepository logRepository;
    private final WorkflowRepository workflowRepository;
    private final StepRepository stepRepository;

    @PostMapping("/workflow/{workflowId}")
    public ExecutionEntity startWorkflow(@PathVariable UUID workflowId, @RequestBody Map<String, Object> data) {
        java.util.Objects.requireNonNull(workflowId);
        return executionService.startExecution(workflowId, data, null);
    }

    @GetMapping
    public List<ExecutionEntity> getAllExecutions() {
        List<ExecutionEntity> executions = executionRepository.findAll();
        // Enrich each execution with workflow name and current step name
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

    @GetMapping("/{id}")
    public ResponseEntity<ExecutionEntity> getExecution(@PathVariable UUID id) {
        return executionRepository.findById(id)
                .map(exec -> {
                    // Enrich with names
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
                    return ResponseEntity.ok(exec);
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/{id}/logs")
    public List<ExecutionLogEntity> getLogs(@PathVariable UUID id) {
        return logRepository.findByExecutionIdOrderByStartedAtAsc(id);
    }

    @PostMapping("/{id}/approve")
    public ResponseEntity<Void> approveStep(@PathVariable UUID id, @RequestParam UUID approverId, @RequestBody(required = false) Map<String, Object> data) {
        executionService.approveStep(id, approverId, data);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/{id}/cancel")
    public ResponseEntity<Void> cancelExecution(@PathVariable UUID id) {
        executionService.cancelExecution(id);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/{id}/retry")
    public ResponseEntity<Void> retryExecution(@PathVariable UUID id) {
        executionService.retryExecution(id);
        return ResponseEntity.ok().build();
    }
}
