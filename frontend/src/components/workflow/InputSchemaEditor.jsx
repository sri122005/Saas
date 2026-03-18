import React, { useState } from 'react';
import { Trash2, Info } from 'lucide-react';
import './InputSchemaEditor.css';

const InputSchemaEditor = ({ schema, onChange }) => {
  const [newField, setNewField] = useState({ name: '', type: 'string', required: false, allowedValues: '' });
  const [editMode, setEditMode] = useState('visual');
  const [jsonText, setJsonText] = useState(JSON.stringify(schema || {}, null, 2));

  const fields = schema ? Object.entries(schema).map(([name, config]) => ({ name, ...config })) : [];

  const handleAddField = () => {
    if (!newField.name.trim()) return;
    const updatedSchema = { ...schema };
    updatedSchema[newField.name] = {
      type: newField.type,
      required: newField.required,
      allowed_values: newField.allowedValues ? newField.allowedValues.split('|').map(v => v.trim()) : null
    };
    onChange(updatedSchema);
    setJsonText(JSON.stringify(updatedSchema, null, 2));
    setNewField({ name: '', type: 'string', required: false, allowedValues: '' });
  };

  const handleRemoveField = (fieldName) => {
    const updatedSchema = { ...schema };
    delete updatedSchema[fieldName];
    onChange(updatedSchema);
    setJsonText(JSON.stringify(updatedSchema, null, 2));
  };

  const handleJsonChange = (val) => {
    setJsonText(val);
    try {
      const parsed = JSON.parse(val);
      onChange(parsed);
    } catch (e) { /* wait for valid JSON */ }
  };

  return (
    <div className="ise-root">
      {/* Header */}
      <div className="ise-header">
        <span className="ise-title">Configuration Model</span>
        <div className="ise-mode-toggle">
          <button
            className={`ise-mode-btn${editMode === 'visual' ? ' active' : ''}`}
            onClick={() => setEditMode('visual')}
          >Designer</button>
          <button
            className={`ise-mode-btn${editMode === 'json' ? ' active' : ''}`}
            onClick={() => { setEditMode('json'); setJsonText(JSON.stringify(schema, null, 2)); }}
          >Raw JSON</button>
        </div>
      </div>

      {editMode === 'visual' ? (
        <div className="ise-visual">
          {/* Existing fields */}
          <div className="ise-fields">
            {fields.length === 0 ? (
              <div className="ise-empty">
                No input parameters defined yet. Add your first field below.
              </div>
            ) : (
              fields.map((field) => (
                <div key={field.name} className="ise-field-row">
                  <div className="ise-field-dot" />
                  <div className="ise-field-info">
                    <span className="ise-field-name">{field.name}</span>
                    <span className="ise-field-meta">
                      {field.type} · {field.required ? 'Required' : 'Optional'}
                      {field.allowed_values?.length > 0 && ` · [${field.allowed_values.join(', ')}]`}
                    </span>
                  </div>
                  <button className="ise-delete-btn" onClick={() => handleRemoveField(field.name)} title="Remove field">
                    <Trash2 size={14} />
                  </button>
                </div>
              ))
            )}
          </div>

          {/* Add new field form */}
          <div className="ise-add-form">
            <p className="ise-add-title">Add New Parameter</p>
            <div className="ise-form-grid">
              <div className="form-group">
                <label className="form-label">Field Name</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="e.g. amount"
                  value={newField.name}
                  onChange={(e) => setNewField({ ...newField, name: e.target.value })}
                  onKeyDown={(e) => e.key === 'Enter' && handleAddField()}
                />
              </div>
              <div className="form-group">
                <label className="form-label">Data Type</label>
                <select
                  className="form-control"
                  value={newField.type}
                  onChange={(e) => setNewField({ ...newField, type: e.target.value })}
                >
                  <option value="string">String</option>
                  <option value="number">Number</option>
                  <option value="boolean">Boolean</option>
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Options (pipe separated)</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Option A | Option B"
                  value={newField.allowedValues}
                  onChange={(e) => setNewField({ ...newField, allowedValues: e.target.value })}
                />
              </div>
              <div className="ise-add-btn-col">
                <button className="btn btn-primary" onClick={handleAddField} style={{ width: '100%' }}>
                  Add
                </button>
              </div>
            </div>
            <label className="ise-checkbox-row">
              <input
                type="checkbox"
                checked={newField.required}
                onChange={(e) => setNewField({ ...newField, required: e.target.checked })}
              />
              <span>Mark as mandatory field</span>
            </label>
          </div>
        </div>
      ) : (
        <div className="ise-json">
          <textarea
            className="form-control font-mono ise-json-textarea"
            value={jsonText}
            onChange={(e) => handleJsonChange(e.target.value)}
            placeholder='{ "fieldName": { "type": "string", "required": true } }'
          />
          <p className="ise-json-hint">
            <Info size={12} /> Valid format: {"{"} "field": {"{"} "type": "string", "required": true {"}"} {"}"}
          </p>
        </div>
      )}
    </div>
  );
};

export default InputSchemaEditor;
