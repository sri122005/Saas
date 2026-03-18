import React, { useState } from 'react';

const WorkflowForm = ({ initialData, onSubmit, onCancel, loading }) => {
  const [formData, setFormData] = useState(initialData || {
    name: '',
    description: '',
    isActive: false,
    inputSchema: {}
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <div className="form-group">
        <label className="form-label">Workflow Name</label>
        <input
          type="text"
          name="name"
          className="form-control"
          value={formData.name}
          onChange={handleChange}
          required
          placeholder="e.g. Expense Approval"
        />
      </div>
      <div className="form-group">
        <label className="form-label">Description</label>
        <textarea
          name="description"
          className="form-control"
          value={formData.description}
          onChange={handleChange}
          rows={3}
          style={{ minHeight: '72px', resize: 'vertical' }}
          placeholder="Describe what this workflow does..."
        />
      </div>
      <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '13px', color: 'var(--text-secondary)' }}>
        <input
          type="checkbox"
          name="isActive"
          checked={formData.isActive}
          onChange={handleChange}
          style={{ accentColor: 'var(--primary)', width: '14px', height: '14px' }}
        />
        Active (Production Mode)
      </label>
      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', paddingTop: '4px' }}>
        <button type="button" className="btn btn-secondary" onClick={onCancel} disabled={loading}>
          Cancel
        </button>
        <button type="submit" className="btn btn-primary" disabled={loading}>
          {loading ? 'Saving…' : 'Save Workflow'}
        </button>
      </div>
    </form>
  );
};

export default WorkflowForm;
