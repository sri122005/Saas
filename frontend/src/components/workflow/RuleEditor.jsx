import React, { useState, useEffect } from 'react';
import { Trash2, ArrowUp, ArrowDown, Settings, PlusCircle } from 'lucide-react';
import { workflowService } from '../../services/api/workflowApi';
import './RuleEditor.css';

const RuleEditor = ({ stepId, workflowId }) => {
  const [rules, setRules] = useState([]);
  const [steps, setSteps] = useState([]);
  const [newRule, setNewRule] = useState({ condition: '', nextStepId: '', priority: 0 });

  useEffect(() => {
    if (stepId) loadRules();
    if (workflowId) loadSteps();
  }, [stepId, workflowId]);

  const loadRules = async () => {
    try {
      const data = await workflowService.getRules(stepId);
      setRules(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Failed to load rules', error);
      setRules([]);
    }
  };

  const loadSteps = async () => {
    try {
      const data = await workflowService.getSteps(workflowId);
      setSteps(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Failed to load steps', error);
      setSteps([]);
    }
  };

  const handleAddRule = async () => {
    if (!newRule.condition || !newRule.nextStepId) return;
    await workflowService.addRule(stepId, { ...newRule, priority: rules.length });
    setNewRule({ condition: '', nextStepId: '', priority: 0 });
    loadRules();
  };

  const handleDeleteRule = async (id) => {
    if (window.confirm('Delete this decision rule?')) {
      await workflowService.deleteRule(id);
      loadRules();
    }
  };

  const handleMovePriority = async (rule, direction) => {
    const sorted = [...rules].sort((a, b) => a.priority - b.priority);
    const idx = sorted.findIndex(r => r.id === rule.id);
    const target = sorted[idx + direction];
    if (!target) return;
    try {
      await Promise.all([
        workflowService.updateRule(rule.id, { ...rule, priority: target.priority }),
        workflowService.updateRule(target.id, { ...target, priority: rule.priority }),
      ]);
      loadRules();
    } catch (e) {
      console.error('Failed to reorder rules', e);
    }
  };

  return (
    <div className="re-root">
      {/* Rules Table */}
      <div className="re-table-wrap">
        <table className="modern-table">
          <thead>
            <tr>
              <th style={{ width: '40px' }}>#</th>
              <th>Condition</th>
              <th>Goes To</th>
              <th style={{ width: '80px', textAlign: 'right' }}>Order</th>
              <th style={{ width: '48px' }}></th>
            </tr>
          </thead>
          <tbody>
            {rules.sort((a, b) => a.priority - b.priority).map((rule, index) => (
              <tr key={rule.id}>
                <td style={{ color: 'var(--text-muted)', fontSize: '12px' }}>{index + 1}</td>
                <td>
                  <code className="re-condition">{rule.condition}</code>
                </td>
                <td>
                  <span className="badge badge-info">
                    {steps.find(s => s.id === rule.nextStepId)?.name || 'TERMINATE'}
                  </span>
                </td>
                <td>
                  <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '2px' }}>
                    <button className="btn-icon-link" onClick={() => handleMovePriority(rule, -1)} disabled={index === 0}>
                      <ArrowUp size={13} />
                    </button>
                    <button className="btn-icon-link" onClick={() => handleMovePriority(rule, 1)} disabled={index === rules.length - 1}>
                      <ArrowDown size={13} />
                    </button>
                  </div>
                </td>
                <td>
                  <button className="btn-icon-link" onClick={() => handleDeleteRule(rule.id)}>
                    <Trash2 size={14} />
                  </button>
                </td>
              </tr>
            ))}
            {rules.length === 0 && (
              <tr>
                <td colSpan={5} style={{ textAlign: 'center', padding: '24px 16px', color: 'var(--text-muted)', fontSize: '12px', fontStyle: 'italic' }}>
                  No conditions defined for this step. Add your first rule below.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Add Rule Form */}
      <div className="re-add-form">
        <div className="re-add-header">
          <Settings size={14} style={{ color: 'var(--primary)' }} />
          <span className="re-add-title">New Transition Rule</span>
        </div>
        <div className="re-form-grid">
          <div className="form-group">
            <label className="form-label">Condition (e.g. amount {'>'} 1000)</label>
            <div style={{ display: 'flex', gap: '8px' }}>
              <input
                type="text"
                className="form-control"
                placeholder="e.g. amount > 1000"
                value={newRule.condition}
                onChange={(e) => setNewRule({ ...newRule, condition: e.target.value })}
                onKeyDown={(e) => e.key === 'Enter' && handleAddRule()}
                style={{ flex: 1 }}
              />
              <button
                className="btn btn-secondary"
                style={{ flexShrink: 0, fontSize: '11px', fontWeight: '700', padding: '7px 10px' }}
                onClick={() => setNewRule({ ...newRule, condition: 'DEFAULT' })}
              >
                DEFAULT
              </button>
            </div>
          </div>
          <div className="form-group">
            <label className="form-label">Target Next Step</label>
            <select
              className="form-control"
              value={newRule.nextStepId}
              onChange={(e) => setNewRule({ ...newRule, nextStepId: e.target.value })}
            >
              <option value="">Select target...</option>
              {steps.filter(s => s.id !== stepId).map(s => (
                <option key={s.id} value={s.id}>{s.name}</option>
              ))}
              <option value="null">Exit Workflow</option>
            </select>
          </div>
        </div>
        <button
          className="btn btn-primary icon-row"
          style={{ width: '100%', justifyContent: 'center', marginTop: '4px' }}
          onClick={handleAddRule}
          disabled={!newRule.condition || !newRule.nextStepId}
        >
          <PlusCircle size={15} />
          Add Transition Rule
        </button>
      </div>
    </div>
  );
};

export default RuleEditor;
