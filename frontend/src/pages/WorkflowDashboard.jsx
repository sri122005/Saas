import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { workflowService } from '../services/api/workflowApi';
import { GitFork, Play, Edit2, Plus, Clock, Cpu } from 'lucide-react';

const WorkflowDashboard = () => {
  const [workflows, setWorkflows] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    loadWorkflows();
  }, []);

  const loadWorkflows = async () => {
    setLoading(true);
    try {
      const data = await workflowService.getAll();
      setWorkflows(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Failed to load workflows', error);
      setWorkflows([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
      {/* Header */}
      <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '16px' }}>
        <div>
          <h1 style={{ fontSize: '26px', fontWeight: '700', letterSpacing: '-0.02em', color: 'var(--text-primary)' }}>
            Automations
          </h1>
          <p style={{ color: 'var(--text-secondary)', marginTop: '4px', fontSize: '14px' }}>
            Design, manage and scale your background workflows.
          </p>
        </div>
        <Link
          to="/workflows/new"
          className="btn btn-primary icon-row"
          style={{ textDecoration: 'none', padding: '10px 20px' }}
        >
          <Plus size={16} strokeWidth={3} />
          New Workflow
        </Link>
      </div>

      {/* Content */}
      {loading ? (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '96px 0' }}>
          <div style={{
            width: '40px', height: '40px',
            border: '4px solid rgba(88, 166, 255, 0.2)',
            borderTopColor: 'var(--primary)',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
          }} />
        </div>
      ) : workflows.length === 0 ? (
        <div style={{
          background: 'var(--bg-card)',
          border: '1px solid var(--border)',
          borderRadius: '4px',
          padding: '96px 24px',
          display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: '24px',
        }}>
          <div style={{
            width: '64px', height: '64px', borderRadius: '4px',
            background: 'var(--bg-main)', border: '1px solid var(--border)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: 'var(--text-muted)',
          }}>
            <Cpu size={40} strokeWidth={1} />
          </div>
          <div>
            <p style={{ fontWeight: '700', color: 'var(--text-primary)', fontSize: '16px' }}>No automations found</p>
            <p style={{ color: 'var(--text-secondary)', fontSize: '14px', marginTop: '4px', maxWidth: '300px' }}>
              Create your first workflow to start automating your business logic.
            </p>
          </div>
          <Link
            to="/workflows/new"
            className="btn btn-secondary"
            style={{ textDecoration: 'none' }}
          >
            Create Workflow
          </Link>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
          {workflows.map(w => (
            <div key={w.id} className="card" style={{ display: 'flex', flexDirection: 'column', overflow: 'hidden', padding: 0 }}>
              <div style={{ padding: '28px', flexGrow: 1 }}>
                {/* Card header */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px' }}>
                  <div className="icon-row">
                    <div style={{
                      width: '40px', height: '40px', borderRadius: '4px',
                      background: 'rgba(88, 166, 255, 0.1)', border: '1px solid rgba(88, 166, 255, 0.2)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                    }}>
                      <GitFork size={18} style={{ color: 'var(--primary)' }} />
                    </div>
                    <div>
                      <h3 style={{ fontWeight: '700', color: 'var(--text-primary)', fontSize: '15px' }}
                          className="text-truncate">
                        {w.name}
                      </h3>
                      <span style={{ fontSize: '11px', fontWeight: '700', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                        ID: {(w.id || '').toString().substring(0, 8)}
                      </span>
                    </div>
                  </div>
                  <span className={`badge ${w.isActive ? 'badge-success' : 'badge-info'}`} style={{ flexShrink: 0 }}>
                    {w.isActive ? 'Active' : 'Draft'}
                  </span>
                </div>

                {/* Meta */}
                <div className="icon-row" style={{ marginTop: '16px' }}>
                  <Clock size={13} style={{ color: 'var(--text-muted)' }} />
                  <span style={{ fontSize: '12px', fontWeight: '700', color: 'var(--text-muted)' }}>
                    v{w.version || 1}
                  </span>
                </div>
              </div>

              {/* Card footer */}
              <div style={{
                padding: '16px 20px',
                borderTop: '1px solid var(--border)',
                background: 'rgba(255,255,255,0.02)',
                display: 'flex', gap: '10px',
              }}>
                <Link
                  to={`/workflows/${w.id}`}
                  className="btn btn-secondary icon-row"
                  style={{ flex: 1, textDecoration: 'none', fontSize: '13px', justifyContent: 'center' }}
                >
                  <Edit2 size={13} />
                  Build
                </Link>
                <button
                  className="btn btn-primary icon-row"
                  style={{ flex: 1, fontSize: '13px', justifyContent: 'center' }}
                  onClick={() => navigate(`/workflows/${w.id}/execute`)}
                >
                  <Play size={13} fill="currentColor" />
                  Run
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default WorkflowDashboard;
