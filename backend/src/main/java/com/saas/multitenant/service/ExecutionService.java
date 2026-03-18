package com.saas.multitenant.service;

import com.saas.multitenant.model.*;
import com.saas.multitenant.repository.*;
import com.saas.multitenant.ruleengine.RuleEngine;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.*;

@Service
@Slf4j
@RequiredArgsConstructor
public class ExecutionService {

    private final WorkflowRepository workflowRepository;
    private final StepRepository stepRepository;
    private final RuleRepository ruleRepository;
    private final ExecutionRepository executionRepository;
    private final ExecutionLogRepository logRepository;
    private final RuleEngine ruleEngine;

    @Transactional
    public ExecutionEntity startExecution(UUID workflowId, Map<String, Object> data, UUID triggeredBy) {
        java.util.Objects.requireNonNull(workflowId);
        WorkflowEntity workflow = workflowRepository.findById(workflowId)
                .orElseThrow(() -> new RuntimeException("Workflow not found"));

        ExecutionEntity execution = ExecutionEntity.builder()
                .workflowId(workflowId)
                .workflowVersion(workflow.getVersion())
                .status(ExecutionStatus.IN_PROGRESS)
                .data(data)
                .currentStepId(workflow.getStartStepId())
                .triggeredBy(triggeredBy)
                .startedAt(LocalDateTime.now())
                .build();

        @SuppressWarnings("null")
        ExecutionEntity saved = executionRepository.save(execution);
        execution = saved;
        processCurrentStep(execution);
        return execution;
    }

    @Transactional
    public void processCurrentStep(ExecutionEntity execution) {
        if (execution.getCurrentStepId() == null) {
            completeExecution(execution, ExecutionStatus.COMPLETED);
            return;
        }

        java.util.Objects.requireNonNull(execution.getCurrentStepId());
        StepEntity step = stepRepository.findById(execution.getCurrentStepId())
                .orElseThrow(() -> new RuntimeException("Step not found: " + execution.getCurrentStepId()));

        ExecutionLogEntity stepLog = ExecutionLogEntity.builder()
                .executionId(execution.getId())
                .stepId(step.getId())
                .stepName(step.getName())
                .stepType(step.getStepType().name())
                .startedAt(LocalDateTime.now())
                .status("IN_PROGRESS")
                .build();

        try {
            if (step.getStepType() == StepType.TASK || step.getStepType() == StepType.NOTIFICATION) {
                evaluateRulesAndMoveToNext(execution, step, stepLog);
            } else if (step.getStepType() == StepType.APPROVAL) {
                stepLog.setStatus("WAITING_FOR_APPROVAL");
                logRepository.save(stepLog);
            }
        } catch (Exception e) {
            handleStepFailure(execution, stepLog, e.getMessage());
        }
    }

    @Transactional
    public void approveStep(UUID executionId, UUID approverId, Map<String, Object> additionalData) {
        ExecutionEntity execution = executionRepository.findById(executionId)
                .orElseThrow(() -> new RuntimeException("Execution not found"));

        if (execution.getStatus() != ExecutionStatus.IN_PROGRESS) {
            throw new RuntimeException("Execution is not in progress");
        }

        java.util.Objects.requireNonNull(execution.getCurrentStepId());
        StepEntity step = stepRepository.findById(execution.getCurrentStepId())
                .orElseThrow(() -> new RuntimeException("Step not found"));

        List<ExecutionLogEntity> logs = logRepository.findByExecutionIdOrderByStartedAtAsc(executionId);
        ExecutionLogEntity stepLog = logs.stream()
                .filter(l -> l.getStepId().equals(step.getId()) && "WAITING_FOR_APPROVAL".equals(l.getStatus()))
                .findFirst()
                .orElseThrow(() -> new RuntimeException("No active approval log found"));

        stepLog.setApproverId(approverId);
        if (additionalData != null) {
            execution.getData().putAll(additionalData);
        }

        evaluateRulesAndMoveToNext(execution, step, stepLog);
    }

    private void evaluateRulesAndMoveToNext(ExecutionEntity execution, StepEntity step, ExecutionLogEntity stepLog) {
        List<RuleEntity> rules = ruleRepository.findByStepIdOrderByPriorityAsc(step.getId());
        List<Map<String, Object>> ruleEvaluations = new ArrayList<>();
        UUID nextStepId = null;

        for (RuleEntity rule : rules) {
            boolean matches = ruleEngine.evaluate(rule.getCondition(), execution.getData());
            ruleEvaluations.add(Map.of(
                    "rule", rule.getCondition(),
                    "result", matches
            ));

            if (matches && nextStepId == null) {
                nextStepId = rule.getNextStepId();
            }
        }

        stepLog.setEvaluatedRules(ruleEvaluations);
        stepLog.setSelectedNextStepId(nextStepId);
        stepLog.setStatus("COMPLETED");
        stepLog.setEndedAt(LocalDateTime.now());
        logRepository.save(stepLog);

        execution.setCurrentStepId(nextStepId);
        executionRepository.save(execution);

        processCurrentStep(execution);
    }

    private void handleStepFailure(ExecutionEntity execution, ExecutionLogEntity stepLog, String error) {
        stepLog.setStatus("FAILED");
        stepLog.setErrorMessage(error);
        stepLog.setEndedAt(LocalDateTime.now());
        logRepository.save(stepLog);

        execution.setStatus(ExecutionStatus.FAILED);
        execution.setEndedAt(LocalDateTime.now());
        executionRepository.save(execution);
    }

    private void completeExecution(ExecutionEntity execution, ExecutionStatus status) {
        execution.setStatus(status);
        execution.setEndedAt(LocalDateTime.now());
        executionRepository.save(execution);
    }

    @Transactional
    public void cancelExecution(UUID executionId) {
        ExecutionEntity execution = executionRepository.findById(executionId)
                .orElseThrow(() -> new RuntimeException("Execution not found"));
        completeExecution(execution, ExecutionStatus.CANCELED);
    }

    @Transactional
    public void retryExecution(UUID executionId) {
        ExecutionEntity execution = executionRepository.findById(executionId)
                .orElseThrow(() -> new RuntimeException("Execution not found"));
        
        if (execution.getStatus() != ExecutionStatus.FAILED) {
            throw new RuntimeException("Only failed executions can be retried");
        }

        execution.setStatus(ExecutionStatus.IN_PROGRESS);
        execution.setRetries(execution.getRetries() + 1);
        execution.setEndedAt(null);
        executionRepository.save(execution);
        
        processCurrentStep(execution);
    }
}
