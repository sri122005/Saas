package com.saas.multitenant.service;

import com.saas.multitenant.model.RuleEntity;
import com.saas.multitenant.model.StepEntity;
import com.saas.multitenant.model.Tenant;
import com.saas.multitenant.model.WorkflowEntity;
import com.saas.multitenant.repository.RuleRepository;
import com.saas.multitenant.repository.StepRepository;
import com.saas.multitenant.repository.TenantRepository;
import com.saas.multitenant.repository.WorkflowRepository;
import com.saas.multitenant.security.SecurityUtils;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class WorkflowService {

    private final WorkflowRepository workflowRepository;
    private final StepRepository stepRepository;
    private final RuleRepository ruleRepository;
    private final TenantRepository tenantRepository;

    public List<WorkflowEntity> getAllWorkflows() {
        Long tenantId = java.util.Objects.requireNonNull(SecurityUtils.getCurrentTenantId());
        Tenant tenant = tenantRepository.findById(tenantId)
                .orElseThrow(() -> new RuntimeException("Tenant not found"));
        return workflowRepository.findByTenant(tenant);
    }

    public WorkflowEntity getWorkflowById(UUID id) {
        java.util.Objects.requireNonNull(id);
        WorkflowEntity workflow = workflowRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Workflow not found"));
        
        // Security check
        Long tenantId = java.util.Objects.requireNonNull(SecurityUtils.getCurrentTenantId());
        if (!workflow.getTenant().getId().equals(tenantId)) {
            throw new RuntimeException("Unauthorized access to workflow");
        }
        return workflow;
    }

    @Transactional
    public WorkflowEntity createWorkflow(WorkflowEntity workflow) {
        Long tenantId = java.util.Objects.requireNonNull(SecurityUtils.getCurrentTenantId());
        Tenant tenant = tenantRepository.findById(tenantId)
                .orElseThrow(() -> new RuntimeException("Tenant not found"));
        workflow.setTenant(tenant);
        if (workflow.getVersion() == null) workflow.setVersion(1);
        if (workflow.getInputSchema() == null) workflow.setInputSchema(new java.util.HashMap<>());
        @SuppressWarnings("null")
        WorkflowEntity saved = workflowRepository.save(workflow);
        return saved;
    }

    @Transactional
    public WorkflowEntity updateWorkflow(UUID id, WorkflowEntity workflowDetails) {
        WorkflowEntity workflow = getWorkflowById(id);
        workflow.setName(workflowDetails.getName());
        workflow.setDescription(workflowDetails.getDescription());
        if (workflowDetails.getInputSchema() != null) {
            workflow.setInputSchema(workflowDetails.getInputSchema());
        }
        workflow.setStartStepId(workflowDetails.getStartStepId());
        workflow.setActive(workflowDetails.isActive());
        workflow.setVersion(workflow.getVersion() + 1);
        return workflowRepository.save(workflow);
    }

    @Transactional
    public void deleteWorkflow(UUID id) {
        workflowRepository.deleteById(id);
    }

    // Steps
    public List<StepEntity> getStepsByWorkflowId(UUID workflowId) {
        return stepRepository.findByWorkflowIdOrderByOrderAsc(workflowId);
    }

    @Transactional
    public StepEntity addStep(StepEntity step) {
        @SuppressWarnings("null")
        StepEntity saved = stepRepository.save(step);
        return saved;
    }

    @Transactional
    public StepEntity updateStep(UUID id, StepEntity stepDetails) {
        java.util.Objects.requireNonNull(id);
        StepEntity step = stepRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Step not found"));
        step.setName(stepDetails.getName());
        step.setStepType(stepDetails.getStepType());
        step.setOrder(stepDetails.getOrder());
        step.setMetadata(stepDetails.getMetadata());
        return stepRepository.save(step);
    }

    @Transactional
    public void deleteStep(UUID id) {
        stepRepository.deleteById(id);
    }

    // Rules
    public List<RuleEntity> getRulesByStepId(UUID stepId) {
        return ruleRepository.findByStepIdOrderByPriorityAsc(stepId);
    }

    @Transactional
    public RuleEntity addRule(RuleEntity rule) {
        @SuppressWarnings("null")
        RuleEntity saved = ruleRepository.save(rule);
        return saved;
    }

    @Transactional
    public RuleEntity updateRule(UUID id, RuleEntity ruleDetails) {
        java.util.Objects.requireNonNull(id);
        RuleEntity rule = ruleRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Rule not found"));
        rule.setCondition(ruleDetails.getCondition());
        rule.setNextStepId(ruleDetails.getNextStepId());
        rule.setPriority(ruleDetails.getPriority());
        return ruleRepository.save(rule);
    }

    @Transactional
    public void deleteRule(UUID id) {
        ruleRepository.deleteById(id);
    }
}
