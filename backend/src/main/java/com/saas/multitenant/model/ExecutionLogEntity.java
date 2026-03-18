package com.saas.multitenant.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@Entity
@Table(name = "workflow_logs")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ExecutionLogEntity {
    @Id
    private UUID id;

    @Column(name = "execution_id", nullable = false)
    private UUID executionId;

    @Column(name = "step_id")
    private UUID stepId;

    @Column(name = "step_name")
    private String stepName;

    @Column(name = "step_type")
    private String stepType;

    @JdbcTypeCode(SqlTypes.JSON)
    @Column(name = "evaluated_rules", columnDefinition = "jsonb")
    private List<Map<String, Object>> evaluatedRules;

    @Column(name = "selected_next_step_id")
    private UUID selectedNextStepId;

    private String status;

    @Column(name = "approver_id")
    private UUID approverId;

    @Column(name = "error_message")
    private String errorMessage;

    @Column(name = "started_at")
    private LocalDateTime startedAt;

    @Column(name = "ended_at")
    private LocalDateTime endedAt;

    @PrePersist
    protected void onCreate() {
        if (id == null) id = UUID.randomUUID();
        if (startedAt == null) startedAt = LocalDateTime.now();
    }
}
