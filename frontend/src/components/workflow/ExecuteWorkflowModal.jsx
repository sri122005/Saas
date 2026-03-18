import React, { useState } from 'react';
import { executionService } from '../../services/api/workflowApi';
import { Play } from 'lucide-react';

const ExecuteWorkflowModal = ({ workflow, onClose, onSuccess }) => {
  const schema = workflow.inputSchema || {};
  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleInputChange = (field, value) => {
    setFormData({ ...formData, [field]: value });
  };

  const handleStart = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await executionService.start(workflow.id, formData);
      onSuccess(data);
      onClose();
    } catch (err) {
      console.error('Failed to start execution', err);
      setError(err.response?.data?.message || 'Failed to start execution');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="wb-modal-overlay" onClick={onClose}>
      <div className="wb-modal-box card" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '480px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px' }}>
          <h3 style={{ fontSize: '15px', fontWeight: '700', color: 'var(--text-primary)', margin: 0 }}>
            Run: {workflow.name}
          </h3>
          <button className="btn-icon-link" onClick={onClose} style={{ fontSize: '18px', padding: '2px 6px' }}>×</button>
        </div>

        <p style={{ fontSize: '13px', color: 'var(--text-secondary)', margin: '0' }}>
          Enter the required input values to start this workflow execution.
        </p>

        {error && (
          <div style={{ padding: '10px 14px', background: 'var(--error-dim)', border: '1px solid rgba(220,38,38,0.2)', borderRadius: 'var(--radius-md)', fontSize: '13px', color: '#f87171' }}>
            {error}
          </div>
        )}

        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {Object.entries(schema).length === 0 ? (
            <p style={{ textAlign: 'center', color: 'var(--text-muted)', fontSize: '13px', fontStyle: 'italic', padding: '16px 0' }}>
              No input parameters required for this workflow.
            </p>
          ) : (
            Object.entries(schema).map(([field, config]) => (
              <div key={field} className="form-group" style={{ margin: 0 }}>
                <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  {field}
                  {config.required && <span style={{ color: '#f87171' }}>*</span>}
                  <span style={{ fontSize: '10px', color: 'var(--text-muted)', fontWeight: '400' }}>({config.type})</span>
                </label>
                {config.allowed_values?.length > 0 ? (
                  <select
                    className="form-control"
                    value={formData[field] || ''}
                    onChange={(e) => handleInputChange(field, e.target.value)}
                  >
                    <option value="">Select value...</option>
                    {config.allowed_values.map(val => (
                      <option key={val} value={val}>{val}</option>
                    ))}
                  </select>
                ) : (
                  <input
                    type={config.type === 'number' ? 'number' : 'text'}
                    className="form-control"
                    placeholder={`Enter ${field}…`}
                    value={formData[field] || ''}
                    onChange={(e) => handleInputChange(field, e.target.value)}
                  />
                )}
              </div>
            ))
          )}
        </div>

        <div className="wb-modal-footer">
          <button className="btn btn-secondary" onClick={onClose}>Cancel</button>
          <button
            className="btn btn-primary icon-row"
            onClick={handleStart}
            disabled={loading}
            style={{ opacity: loading ? 0.7 : 1 }}
          >
            <Play size={13} fill="currentColor" />
            {loading ? 'Starting…' : 'Start Execution'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ExecuteWorkflowModal;
