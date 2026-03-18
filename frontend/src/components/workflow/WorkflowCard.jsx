import React from 'react';
import { Link } from 'react-router-dom';
import { GitFork, Play, Edit2 } from 'lucide-react';

const WorkflowCard = ({ workflow, onExecute }) => {
  return (
    <div className="card animate-fade-in" style={{ display: 'flex', flexDirection: 'column', overflow: 'hidden', padding: 0 }}>
      <div style={{ padding: '20px', flex: 1 }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '12px', marginBottom: '10px' }}>
          <h3 style={{ fontSize: '14px', fontWeight: '700', color: 'var(--text-primary)', margin: 0 }}>
            {workflow.name}
          </h3>
          <span className="badge badge-info" style={{ flexShrink: 0 }}>v{workflow.version || 1}</span>
        </div>
        <p style={{ fontSize: '12px', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
          {workflow.description || 'Enterprise automation flow with custom logic.'}
        </p>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '12px' }}>
          <span style={{
            width: '7px', height: '7px', borderRadius: '50%',
            background: workflow.isActive ? '#4ade80' : '#fbbf24',
            flexShrink: 0
          }} />
          <span style={{ fontSize: '10px', fontWeight: '600', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
            {workflow.isActive ? 'Production' : 'Draft'}
          </span>
        </div>
      </div>
      <div style={{ padding: '12px 20px', borderTop: '1px solid var(--border)', display: 'flex', gap: '8px' }}>
        <Link
          to={`/workflows/${workflow.id}`}
          className="btn btn-secondary icon-row"
          style={{ flex: 1, textDecoration: 'none', justifyContent: 'center', fontSize: '12px' }}
        >
          <Edit2 size={13} />
          Build
        </Link>
        <button
          className="btn btn-primary icon-row"
          style={{ flex: 1, justifyContent: 'center', fontSize: '12px' }}
          onClick={() => onExecute(workflow)}
        >
          <Play size={13} fill="currentColor" />
          Launch
        </button>
      </div>
    </div>
  );
};

export default WorkflowCard;
