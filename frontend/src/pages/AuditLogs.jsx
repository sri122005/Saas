import React, { useState, useEffect } from 'react';
import { Activity, Search, RefreshCw, CheckCircle, XCircle, Clock, Filter } from 'lucide-react';
import { auditService } from '../services/api/workflowApi';
import ExecutionLogsModal from '../components/workflow/ExecutionLogsModal';
import './AuditLogs.css';

const statusConfig = {
  COMPLETED: { label: 'Completed', cls: 'badge-success', dot: '#4ade80' },
  FAILED:    { label: 'Failed',    cls: 'badge-danger',  dot: '#f87171' },
  CANCELED:  { label: 'Canceled', cls: 'badge-warning', dot: '#fbbf24' },
  IN_PROGRESS: { label: 'In Progress', cls: 'badge-info', dot: 'var(--primary)' },
  PENDING:   { label: 'Pending',  cls: 'badge-info',    dot: 'var(--text-muted)' },
};

const formatTs = (ts) => {
  if (!ts) return '—';
  return new Date(ts).toLocaleString(undefined, {
    month: 'short', day: 'numeric',
    hour: '2-digit', minute: '2-digit'
  });
};

const formatDuration = (start, end) => {
  if (!start) return '—';
  const diff = Math.max(0, new Date(end || new Date()) - new Date(start));
  const m = Math.floor(diff / 60000);
  const s = Math.floor((diff % 60000) / 1000);
  if (m > 0) return `${m}m ${s}s`;
  return `${s}s`;
};

const AuditLogPage = () => {
  const [executions, setExecutions] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [selectedExecutionId, setSelectedExecutionId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');

  useEffect(() => { loadExecutions(); }, []);

  useEffect(() => {
    let list = executions;
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(e =>
        (e.workflowName || '').toLowerCase().includes(q) ||
        (e.id || '').toLowerCase().includes(q)
      );
    }
    if (statusFilter !== 'ALL') {
      list = list.filter(e => e.status === statusFilter);
    }
    setFiltered(list);
  }, [search, statusFilter, executions]);

  const loadExecutions = async () => {
    setLoading(true);
    try {
      const data = await auditService.getAll();
      setExecutions(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Failed to load audit logs', err);
      setExecutions([]);
    } finally {
      setLoading(false);
    }
  };

  const statuses = ['ALL', 'COMPLETED', 'IN_PROGRESS', 'FAILED', 'CANCELED'];

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>

      {/* Page Header */}
      <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h1 style={{ fontSize: '26px', fontWeight: '700', letterSpacing: '-0.02em', color: 'var(--text-primary)', margin: 0 }}>
            Audit Logs
          </h1>
          <p style={{ color: 'var(--text-secondary)', marginTop: '4px', fontSize: '13px' }}>
            Complete execution history for tracking, debugging, and compliance.
          </p>
        </div>
        <button className="btn btn-secondary icon-row" onClick={loadExecutions} disabled={loading}>
          <RefreshCw size={14} style={{ animation: loading ? 'spin 0.8s linear infinite' : 'none' }} />
          Refresh
        </button>
      </div>

      {/* Filters */}
      <div className="al-filters">
        <div className="al-search-wrap">
          <Search size={14} className="al-search-icon" />
          <input
            type="text"
            className="form-control al-search"
            placeholder="Search by workflow name or run ID…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="al-status-pills">
          {statuses.map(s => (
            <button
              key={s}
              className={`al-pill${statusFilter === s ? ' active' : ''}`}
              onClick={() => setStatusFilter(s)}
            >
              {s === 'ALL' ? 'All' : (statusConfig[s]?.label || s)}
            </button>
          ))}
        </div>
      </div>

      {/* Stats bar */}
      <div className="al-stats">
        {['COMPLETED', 'IN_PROGRESS', 'FAILED'].map(s => {
          const count = executions.filter(e => e.status === s).length;
          const cfg = statusConfig[s];
          return (
            <div key={s} className="al-stat-item">
              <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: cfg.dot, flexShrink: 0 }} />
              <span style={{ fontSize: '12px', fontWeight: '600', color: 'var(--text-secondary)' }}>{cfg.label}</span>
              <span style={{ fontSize: '13px', fontWeight: '700', color: 'var(--text-primary)', marginLeft: 'auto' }}>{count}</span>
            </div>
          );
        })}
        <div className="al-stat-item">
          <Activity size={14} style={{ color: 'var(--text-muted)', flexShrink: 0 }} />
          <span style={{ fontSize: '12px', fontWeight: '600', color: 'var(--text-secondary)' }}>Total</span>
          <span style={{ fontSize: '13px', fontWeight: '700', color: 'var(--text-primary)', marginLeft: 'auto' }}>{executions.length}</span>
        </div>
      </div>

      {/* Table */}
      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        {loading ? (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '64px 0' }}>
            <div style={{ width: '28px', height: '28px', border: '2px solid var(--border)', borderTopColor: 'var(--primary)', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
          </div>
        ) : (
          <table className="modern-table">
            <thead>
              <tr>
                <th style={{ width: '120px' }}>Run ID</th>
                <th>Workflow</th>
                <th style={{ textAlign: 'center', width: '80px' }}>Version</th>
                <th style={{ width: '140px' }}>Status</th>
                <th style={{ width: '80px', textAlign: 'right' }}>Duration</th>
                <th style={{ width: '140px', textAlign: 'right' }}>Started At</th>
                <th style={{ width: '60px' }}></th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(e => {
                const cfg = statusConfig[e.status] || statusConfig.PENDING;
                return (
                  <tr
                    key={e.id}
                    className="al-row"
                    onClick={() => setSelectedExecutionId(e.id)}
                  >
                    <td>
                      <code style={{ fontSize: '11px', fontWeight: '600', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', letterSpacing: '0.05em', background: 'var(--bg-secondary)', padding: '3px 7px', borderRadius: 'var(--radius-sm)' }}>
                        {(e.id || '').substring(0, 8).toUpperCase()}
                      </code>
                    </td>
                    <td>
                      <span style={{ fontSize: '13px', fontWeight: '600', color: 'var(--text-primary)' }}>
                        {e.workflowName || <span style={{ color: 'var(--text-muted)', fontStyle: 'italic' }}>—</span>}
                      </span>
                    </td>
                    <td style={{ textAlign: 'center' }}>
                      <span className="badge badge-info">v{e.workflowVersion || 1}</span>
                    </td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '7px' }}>
                        <span style={{ width: '7px', height: '7px', borderRadius: '50%', background: cfg.dot, flexShrink: 0 }} />
                        <span className={`badge ${cfg.cls}`}>{cfg.label}</span>
                      </div>
                    </td>
                    <td style={{ textAlign: 'right', fontSize: '12px', fontWeight: '600', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                      {formatDuration(e.startedAt, e.endedAt)}
                    </td>
                    <td style={{ textAlign: 'right', fontSize: '11px', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                      {formatTs(e.startedAt)}
                    </td>
                    <td>
                      <button
                        className="btn btn-secondary"
                        style={{ padding: '4px 10px', fontSize: '11px', fontWeight: '600' }}
                        onClick={(ev) => { ev.stopPropagation(); setSelectedExecutionId(e.id); }}
                      >
                        Logs
                      </button>
                    </td>
                  </tr>
                );
              })}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={7} style={{ textAlign: 'center', padding: '64px 0' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px' }}>
                      <div style={{ width: '52px', height: '52px', borderRadius: 'var(--radius-md)', background: 'var(--bg-secondary)', border: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)' }}>
                        <Activity size={24} strokeWidth={1.5} />
                      </div>
                      <p style={{ fontSize: '13px', color: 'var(--text-secondary)', margin: 0 }}>
                        {executions.length === 0
                          ? 'No execution history yet. Run a workflow to see logs here.'
                          : 'No results match your search or filter.'}
                      </p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>

      {selectedExecutionId && (
        <ExecutionLogsModal
          executionId={selectedExecutionId}
          onClose={() => setSelectedExecutionId(null)}
        />
      )}
    </div>
  );
};

export default AuditLogPage;
