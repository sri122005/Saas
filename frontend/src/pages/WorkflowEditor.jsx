import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { workflowService } from '../services/api/workflowApi';
import WorkflowBuilder from '../components/workflow/WorkflowBuilder';
import RuleEditor from '../components/workflow/RuleEditor';
import InputSchemaEditor from '../components/workflow/InputSchemaEditor';
import { Settings, Database, GitFork, Save, ArrowLeft, Info } from 'lucide-react';
import './WorkflowEditor.css';

const WorkflowEditor = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [workflow, setWorkflow] = useState({ 
        name: '', 
        description: '', 
        version: 1, 
        isActive: false,
        inputSchema: {} 
    });
    const [selectedStep, setSelectedStep] = useState(null);
    const [saving, setSaving] = useState(false);
    const [saveStatus, setSaveStatus] = useState(null); // 'success' | 'error' | null

    useEffect(() => {
        if (id && id !== 'new') {
            loadWorkflow();
        }
    }, [id]);

    const loadWorkflow = async () => {
        try {
            const data = await workflowService.getById(id);
            setWorkflow(data);
        } catch (error) {
            console.error("Failed to load workflow", error);
        }
    };

    const handleSave = async () => {
        if (!workflow.name || !workflow.name.trim()) {
            setSaveStatus('error');
            setTimeout(() => setSaveStatus(null), 3000);
            return;
        }
        setSaving(true);
        setSaveStatus(null);
        try {
            if (id === 'new' || !workflow.id) {
                const createdWorkflow = await workflowService.create({
                    name: workflow.name,
                    description: workflow.description || '',
                    version: workflow.version || 1,
                    isActive: workflow.isActive || false,
                    inputSchema: workflow.inputSchema || {}
                });
                navigate(`/workflows/${createdWorkflow.id}`);
            } else {
                await workflowService.update(id, workflow);
                setSaveStatus('success');
                setTimeout(() => setSaveStatus(null), 2500);
                loadWorkflow();
            }
        } catch (error) {
            console.error('Failed to save workflow', error);
            setSaveStatus('error');
            setTimeout(() => setSaveStatus(null), 4000);
        } finally {
            setSaving(false);
        }
    };

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
      {/* Sticky Header */}
      <div style={{
        position: 'sticky',
        top: 'var(--header-height)',
        zIndex: 50,
        background: 'var(--bg-main)',
        borderBottom: '1px solid var(--border)',
        margin: '0 -32px',
        padding: '12px 32px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '16px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <button 
            className="btn btn-secondary"
            style={{ width: '32px', height: '32px', padding: 0, flexShrink: 0 }}
            onClick={() => navigate('/workflows')}
          >
            <ArrowLeft size={16} />
          </button>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '3px' }}>
            <h1 style={{ fontSize: '15px', fontWeight: '600', color: 'var(--text-primary)', margin: 0 }}>
              {id === 'new' ? 'New Automation' : workflow.name}
            </h1>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span className="badge badge-info">v{workflow.version || 1}</span>
              <span style={{ fontSize: '10px', fontWeight: '600', color: 'var(--text-muted)', letterSpacing: '0.08em', textTransform: 'uppercase' }}>Workspace Draft</span>
            </div>
          </div>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '4px' }}>
          {saveStatus === 'success' && (
            <span style={{ fontSize: '11px', fontWeight: '600', color: '#4ade80' }}>✓ Saved</span>
          )}
          {saveStatus === 'error' && (
            <span style={{ fontSize: '11px', fontWeight: '600', color: '#f87171' }}>
              {!workflow.name?.trim() ? '⚠ Flow name required' : '✗ Save failed'}
            </span>
          )}
          <button 
            className="btn btn-primary icon-row"
            onClick={handleSave}
            disabled={saving}
            style={{ opacity: saving ? 0.7 : 1 }}
          >
            <Save size={14} strokeWidth={2.5} />
            {saving ? 'Saving…' : 'Save Changes'}
          </button>
        </div>
      </div>

      <div className="grid grid-2" style={{ gridTemplateColumns: 'minmax(300px, 1fr) 2fr' }}>
        {/* Left Column: Settings */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
          <div className="card">
            <div style={{ padding: '16px 24px', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: '12px' }}>
              <Settings size={18} style={{ color: 'var(--primary)' }} />
              <h3 style={{ fontSize: '12px', fontWeight: '900', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--text-secondary)' }}>General Settings</h3>
            </div>
            <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div className="form-group">
                <label className="form-label">Flow Name</label>
                <input 
                  type="text" 
                  className="form-control"
                  value={workflow.name} 
                  onChange={(e) => setWorkflow({...workflow, name: e.target.value})}
                  placeholder="e.g. Lead Qualification Engine"
                />
              </div>
              <div className="form-group">
                <label className="form-label">Brief Description</label>
                <textarea 
                  className="form-control"
                  style={{ minHeight: '80px' }}
                  value={workflow.description} 
                  onChange={(e) => setWorkflow({...workflow, description: e.target.value})}
                  placeholder="What is the objective of this automation?"
                />
              </div>
            </div>
          </div>

          <div className="card">
            <div style={{ padding: '16px 24px', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: '12px' }}>
              <Database size={18} style={{ color: '#3fb950' }} />
              <h3 style={{ fontSize: '12px', fontWeight: '900', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--text-secondary)' }}>Input Parameters</h3>
            </div>
            <div style={{ padding: '24px' }}>
              <InputSchemaEditor 
                schema={workflow.inputSchema}
                onChange={(schema) => setWorkflow({...workflow, inputSchema: schema})}
              />
            </div>
          </div>
        </div>

        {/* Right Column: Designer */}
        <div className="card" style={{ display: 'flex', flexDirection: 'column', minHeight: '700px' }}>
          <div style={{ padding: '16px 24px', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div className="icon-row">
              <GitFork size={18} style={{ color: '#d29922' }} />
              <h3 style={{ fontSize: '12px', fontWeight: '900', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--text-secondary)' }}>Execution Logic Designer</h3>
            </div>
            <div style={{ background: 'rgba(88, 166, 255, 0.1)', padding: '4px 12px', borderRadius: '20px', fontSize: '10px', fontWeight: '700', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Info size={12} style={{ color: 'var(--primary)' }} />
              Interact with nodes to configure steps
            </div>
          </div>
          
          <div style={{ flex: 1, background: 'rgba(1, 4, 9, 0.2)', position: 'relative', overflow: 'hidden' }}>
            <WorkflowBuilder 
              workflowId={id === 'new' ? null : id} 
              onSelectStep={(step) => setSelectedStep(step)}
              selectedStepId={selectedStep?.id}
            />
          </div>

          {selectedStep && (
            <div style={{ borderTop: '1px solid var(--border)', background: 'var(--bg-card)', zIndex: 10, animation: 'fadeIn 0.3s ease-out' }}>
              <div style={{ padding: '12px 24px', borderBottom: '1px solid var(--border)', background: 'rgba(255,255,255,0.02)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'rgba(88, 166, 255, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary)', fontWeight: '700', fontSize: '12px' }}>S</div>
                  <span style={{ fontSize: '14px', fontWeight: '700', color: '#fff' }}>Configuring: {selectedStep.label}</span>
                </div>
                <button 
                  style={{ background: 'none', border: 'none', color: 'var(--text-muted)', fontSize: '10px', fontWeight: '900', textTransform: 'uppercase', letterSpacing: '0.1em', cursor: 'pointer' }}
                  onClick={() => setSelectedStep(null)}
                >
                  Close
                </button>
              </div>
              <div style={{ padding: '24px' }}>
                <RuleEditor 
                  stepId={selectedStep.id} 
                  workflowId={id} 
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default WorkflowEditor;
