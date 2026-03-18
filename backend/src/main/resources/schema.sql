-- Create Workflow table
CREATE TABLE workflows (
    id UUID PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    version INTEGER NOT NULL DEFAULT 1,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    input_schema JSONB,
    start_step_id UUID,
    tenant_id BIGINT,
    created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create Step table
CREATE TABLE steps (
    id UUID PRIMARY KEY,
    workflow_id UUID NOT NULL REFERENCES workflows(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    step_type VARCHAR(50) NOT NULL, -- task, approval, notification
    "order" INTEGER NOT NULL,
    metadata JSONB,
    created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create Rule table
CREATE TABLE rules (
    id UUID PRIMARY KEY,
    step_id UUID NOT NULL REFERENCES steps(id) ON DELETE CASCADE,
    condition TEXT NOT NULL,
    next_step_id UUID,
    priority INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create Execution table
CREATE TABLE workflow_executions (
    id UUID PRIMARY KEY,
    workflow_id UUID NOT NULL REFERENCES workflows(id),
    workflow_version INTEGER NOT NULL,
    status VARCHAR(50) NOT NULL, -- pending, in_progress, completed, failed, canceled
    data JSONB,
    current_step_id UUID REFERENCES steps(id),
    retries INTEGER DEFAULT 0,
    triggered_by UUID,
    started_at TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    ended_at TIMESTAMP WITHOUT TIME ZONE
);

-- Create Workflow Logs table
CREATE TABLE workflow_logs (
    id UUID PRIMARY KEY,
    execution_id UUID NOT NULL REFERENCES workflow_executions(id) ON DELETE CASCADE,
    step_id UUID REFERENCES steps(id),
    step_name VARCHAR(255),
    step_type VARCHAR(50),
    evaluated_rules JSONB,
    selected_next_step_id UUID,
    status VARCHAR(50),
    approver_id UUID,
    error_message TEXT,
    started_at TIMESTAMP WITHOUT TIME ZONE,
    ended_at TIMESTAMP WITHOUT TIME ZONE
);
