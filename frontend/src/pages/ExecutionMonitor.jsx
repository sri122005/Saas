import React, { useState, useEffect } from 'react';
import { executionService } from '../services/api/workflowApi';
import ExecutionLogsModal from '../components/workflow/ExecutionLogsModal';
import './ExecutionMonitor.css';

const statusColor = (status) => {
    if (status === 'COMPLETED') return '#4ade80';
    if (status === 'FAILED') return '#f87171';
    if (status === 'CANCELED') return '#9ca3af';
    return 'var(--primary)'; // IN_PROGRESS, PENDING
};

const statusBadge = (status) => {
    if (status === 'COMPLETED') return 'badge-success';
    if (status === 'FAILED') return 'badge-danger';
    return 'badge-info';
};

const formatDuration = (start, end) => {
    if (!start) return '—';
    const from = new Date(start);
    const to = end ? new Date(end) : new Date();
    const diff = Math.max(0, to - from);
    const m = Math.floor(diff / 60000);
    const s = Math.floor((diff % 60000) / 1000);
    if (m > 0) return `${m}m ${s}s`;
    return `${s}s`;
};

const ExecutionMonitor = () => {
    const [executions, setExecutions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedExecutionId, setSelectedExecutionId] = useState(null);
    const isFetching = React.useRef(false);

    useEffect(() => {
        loadExecutions();
        const interval = setInterval(() => {
            if (!isFetching.current) loadExecutions();
        }, 5000);
        return () => clearInterval(interval);
    }, []);

    const loadExecutions = async () => {
        if (isFetching.current) return;
        isFetching.current = true;
        try {
            const data = await executionService.getAll();
            setExecutions(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error('Failed to load executions', error);
        } finally {
            isFetching.current = false;
            setLoading(false);
        }
    };

    if (loading && executions.length === 0) {
        return (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '80px 0' }}>
                <div style={{
                    width: '32px', height: '32px',
                    border: '2px solid var(--border)',
                    borderTopColor: 'var(--primary)',
                    borderRadius: '50%',
                    animation: 'spin 0.8s linear infinite'
                }} />
            </div>
        );
    }

    return (
        <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
            {/* Page Header */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
                <div>
                    <h1 style={{ fontSize: '26px', fontWeight: '700', letterSpacing: '-0.02em', color: 'var(--text-primary)', margin: 0 }}>
                        Execution Monitor
                    </h1>
                    <p style={{ color: 'var(--text-secondary)', marginTop: '4px', fontSize: '13px' }}>
                        Track real-time progress and required actions for all active workflows.
                    </p>
                </div>
                <span className="badge badge-success" style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '6px 12px' }}>
                    <span style={{ width: '7px', height: '7px', borderRadius: '50%', background: '#4ade80', animation: 'pulse 1.2s infinite' }} />
                    Live Monitoring
                </span>
            </div>

            {/* Executions Grid */}
            {executions.length === 0 ? (
                <div className="card" style={{ padding: '80px 24px', textAlign: 'center' }}>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '13px', fontWeight: '500' }}>
                        No executions yet. Run a workflow to see it here.
                    </p>
                </div>
            ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '16px' }}>
                    {executions.map(e => {
                        const isCompleted = e.status === 'COMPLETED';
                        const isFailed = e.status === 'FAILED';
                        const accent = statusColor(e.status);
                        return (
                            <div key={e.id} className="card em-card" style={{ padding: 0, overflow: 'hidden' }}>
                                {/* Card top accent bar */}
                                <div style={{ height: '3px', background: accent, opacity: isCompleted ? 1 : 0.6 }} />

                                <div style={{ padding: '20px' }}>
                                    {/* Header */}
                                    <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '12px', marginBottom: '16px' }}>
                                        <div style={{ minWidth: 0 }}>
                                            <h3 style={{ fontSize: '14px', fontWeight: '700', color: 'var(--text-primary)', margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                                {e.workflowName || 'Workflow Execution'}
                                            </h3>
                                            <span style={{ fontSize: '10px', fontWeight: '600', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', textTransform: 'uppercase' }}>
                                                v{e.workflowVersion || 1}
                                            </span>
                                        </div>
                                        <span className={`badge ${statusBadge(e.status)}`} style={{ flexShrink: 0 }}>
                                            {e.status}
                                        </span>
                                    </div>

                                    {/* Current Step */}
                                    <div style={{ marginBottom: '14px' }}>
                                        <p style={{ fontSize: '10px', fontWeight: '600', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '6px' }}>Current Step</p>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 12px', background: 'var(--bg-secondary)', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)' }}>
                                            <div style={{ width: '20px', height: '20px', borderRadius: 'var(--radius-sm)', background: isCompleted ? 'rgba(74,222,128,0.15)' : 'var(--primary-dim)', border: `1px solid ${accent}33`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                                                {isCompleted ? (
                                                    <span style={{ fontSize: '11px' }}>✓</span>
                                                ) : isFailed ? (
                                                    <span style={{ fontSize: '11px' }}>✗</span>
                                                ) : (
                                                    <div style={{ width: '8px', height: '8px', borderRadius: '50%', border: '2px solid var(--primary)', borderTopColor: 'transparent', animation: 'spin 0.8s linear infinite' }} />
                                                )}
                                            </div>
                                            <span style={{ fontSize: '12px', fontWeight: '600', color: accent, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                                {isCompleted ? 'Completed' : (e.currentStepName || 'Processing…')}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Progress bar */}
                                    <div style={{ marginBottom: '14px' }}>
                                        <p style={{ fontSize: '10px', fontWeight: '600', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '6px' }}>Phase Progress</p>
                                        <div style={{ height: '5px', background: 'var(--border)', borderRadius: '3px', overflow: 'hidden' }}>
                                            <div style={{
                                                width: isCompleted ? '100%' : isFailed ? '60%' : '65%',
                                                height: '100%',
                                                background: accent,
                                                transition: 'width 0.5s ease',
                                            }} />
                                        </div>
                                    </div>
                                </div>

                                {/* Card footer */}
                                <div style={{ padding: '10px 20px', borderTop: '1px solid var(--border)', background: 'rgba(255,255,255,0.01)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px' }}>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1px' }}>
                                        <span style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', fontWeight: '600', color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                                            {(e.id || '').toString().substring(0, 8).toUpperCase()}
                                        </span>
                                        <span style={{ fontSize: '10px', color: 'var(--text-muted)' }}>
                                            {formatDuration(e.startedAt, e.endedAt)}
                                        </span>
                                    </div>
                                    <button
                                        className="btn btn-secondary"
                                        style={{ padding: '5px 12px', fontSize: '12px' }}
                                        onClick={() => setSelectedExecutionId(e.id)}
                                    >
                                        Details
                                    </button>
                                </div>

                                {e.status === 'WAITING_FOR_APPROVAL' && (
                                    <div style={{ padding: '6px 20px', background: 'rgba(251,191,36,0.08)', color: '#fbbf24', textAlign: 'center', fontSize: '10px', fontWeight: '700', letterSpacing: '0.1em', borderTop: '1px solid rgba(251,191,36,0.2)', textTransform: 'uppercase' }}>
                                        ⚡ Action Required
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            )}

            {selectedExecutionId && (
                <ExecutionLogsModal
                    executionId={selectedExecutionId}
                    onClose={() => setSelectedExecutionId(null)}
                />
            )}
        </div>
    );
};

export default ExecutionMonitor;
