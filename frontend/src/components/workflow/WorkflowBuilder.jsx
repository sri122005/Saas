import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Edit3, GripVertical } from 'lucide-react';
import { workflowService } from '../../services/api/workflowApi';
import './WorkflowBuilder.css';

const WorkflowBuilder = ({ workflowId, onSelectStep, selectedStepId }) => {
  const [steps, setSteps] = useState([]);
  const [showStepModal, setShowStepModal] = useState(false);
  const [newStep, setNewStep] = useState({ name: '', stepType: 'TASK', order: 0 });

  useEffect(() => {
    if (workflowId) loadSteps();
  }, [workflowId]);

  const loadSteps = async () => {
    try {
      const data = await workflowService.getSteps(workflowId);
      setSteps(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Failed to load steps", error);
      setSteps([]);
    }
  };

  const handleAddStep = async () => {
    if (!workflowId) return; // guard: should not happen, button is hidden
    if (!newStep.name.trim()) return;
    await workflowService.addStep(workflowId, { ...newStep, order: steps.length + 1 });
    setShowStepModal(false);
    setNewStep({ name: '', stepType: 'TASK', order: 0 });
    loadSteps();
  };

  // If workflow hasn't been saved yet, show a prompt
  if (!workflowId) {
    return (
      <div className="wb-save-first">
        <div className="wb-save-icon">💾</div>
        <p className="wb-save-msg">Save the workflow first to start adding logic steps.</p>
        <p className="wb-save-hint">Enter a Flow Name above and click <strong>Save Changes</strong>.</p>
      </div>
    );
  }

  const handleDeleteStep = async (id) => {
    if (window.confirm('Delete this step?')) {
      await workflowService.deleteStep(id);
      loadSteps();
    }
  };

  return (
    <div className="wb-root">
      <div className="wb-steps">
        {steps.map((step, index) => (
          <div
            key={step.id}
            className={`wb-step-card${selectedStepId === step.id ? ' wb-step-card--active' : ''}`}
            onClick={() => onSelectStep && onSelectStep(step)}
          >
            <div className="wb-step-left">
              <GripVertical size={14} className="wb-drag-handle" />
              <div className="wb-step-num">{index + 1}</div>
              <div className="wb-step-info">
                <span className="wb-step-name">{step.name}</span>
                <span className="wb-step-type">{step.stepType}</span>
              </div>
            </div>
            <div className="wb-step-actions">
              <button
                className="btn-icon-link"
                title="Configure"
                onClick={(e) => { e.stopPropagation(); onSelectStep(step); }}
              >
                <Edit3 size={14} />
              </button>
              <button
                className="btn-icon-link"
                title="Delete"
                onClick={(e) => { e.stopPropagation(); handleDeleteStep(step.id); }}
              >
                <Trash2 size={14} />
              </button>
            </div>
          </div>
        ))}

        <button
          className="wb-add-step-btn"
          onClick={() => setShowStepModal(true)}
        >
          <Plus size={16} />
          <span>Add New Logic Step</span>
        </button>
      </div>

      {showStepModal && (
        <div className="wb-modal-overlay" onClick={() => setShowStepModal(false)}>
          <div className="wb-modal-box card" onClick={(e) => e.stopPropagation()}>
            <h4 className="wb-modal-title">New Workflow Step</h4>
            <div className="form-group">
              <label className="form-label">Step Name</label>
              <input
                type="text"
                className="form-control"
                placeholder="e.g. Manager Review"
                value={newStep.name}
                onChange={(e) => setNewStep({ ...newStep, name: e.target.value })}
                onKeyDown={(e) => e.key === 'Enter' && handleAddStep()}
                autoFocus
              />
            </div>
            <div className="form-group">
              <label className="form-label">Step Type</label>
              <select
                className="form-control"
                value={newStep.stepType}
                onChange={(e) => setNewStep({ ...newStep, stepType: e.target.value })}
              >
                <option value="TASK">Manual Task</option>
                <option value="APPROVAL">Approval Gate</option>
                <option value="NOTIFICATION">Auto Notification</option>
              </select>
            </div>
            <div className="wb-modal-footer">
              <button className="btn btn-secondary" onClick={() => setShowStepModal(false)}>Cancel</button>
              <button className="btn btn-primary" onClick={handleAddStep}>Create Step</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default WorkflowBuilder;
