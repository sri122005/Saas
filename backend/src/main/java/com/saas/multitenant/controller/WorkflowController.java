package com.saas.multitenant.controller;

import com.saas.multitenant.model.RuleEntity;
import com.saas.multitenant.model.StepEntity;
import com.saas.multitenant.model.WorkflowEntity;
import com.saas.multitenant.service.WorkflowService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/workflows")
@RequiredArgsConstructor
public class WorkflowController {

    private final WorkflowService workflowService;

    @GetMapping
    public List<WorkflowEntity> getAllWorkflows() {
        return workflowService.getAllWorkflows();
    }

    @GetMapping("/{id}")
    public ResponseEntity<WorkflowEntity> getWorkflowById(@PathVariable UUID id) {
        return ResponseEntity.ok(workflowService.getWorkflowById(id));
    }

    @PostMapping
    @Transactional
    public WorkflowEntity createWorkflow(@RequestBody WorkflowEntity workflow) {
        return workflowService.createWorkflow(workflow);
    }

    @PutMapping("/{id}")
    @Transactional
    public WorkflowEntity updateWorkflow(@PathVariable UUID id, @RequestBody WorkflowEntity workflow) {
        return workflowService.updateWorkflow(id, workflow);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteWorkflow(@PathVariable UUID id) {
        workflowService.deleteWorkflow(id);
        return ResponseEntity.noContent().build();
    }

    // Steps
    @GetMapping("/{id}/steps")
    public List<StepEntity> getStepsByWorkflow(@PathVariable UUID id) {
        return workflowService.getStepsByWorkflowId(id);
    }

    @PostMapping("/{id}/steps")
    public StepEntity addStep(@PathVariable UUID id, @RequestBody StepEntity step) {
        step.setWorkflowId(id);
        return workflowService.addStep(step);
    }

    @PutMapping("/steps/{stepId}")
    public StepEntity updateStep(@PathVariable UUID stepId, @RequestBody StepEntity step) {
        return workflowService.updateStep(stepId, step);
    }

    @DeleteMapping("/steps/{stepId}")
    public ResponseEntity<Void> deleteStep(@PathVariable UUID stepId) {
        workflowService.deleteStep(stepId);
        return ResponseEntity.noContent().build();
    }

    // Rules
    @GetMapping("/steps/{stepId}/rules")
    public List<RuleEntity> getRulesByStep(@PathVariable UUID stepId) {
        return workflowService.getRulesByStepId(stepId);
    }

    @PostMapping("/steps/{stepId}/rules")
    public RuleEntity addRule(@PathVariable UUID stepId, @RequestBody RuleEntity rule) {
        rule.setStepId(stepId);
        return workflowService.addRule(rule);
    }

    @PutMapping("/rules/{ruleId}")
    public RuleEntity updateRule(@PathVariable UUID ruleId, @RequestBody RuleEntity rule) {
        return workflowService.updateRule(ruleId, rule);
    }

    @DeleteMapping("/rules/{ruleId}")
    public ResponseEntity<Void> deleteRule(@PathVariable UUID ruleId) {
        workflowService.deleteRule(ruleId);
        return ResponseEntity.noContent().build();
    }
}
