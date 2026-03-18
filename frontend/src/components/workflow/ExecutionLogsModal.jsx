import React, { useState, useEffect } from 'react';
import { executionService } from '../../services/api/workflowApi';
import './ExecutionLogsModal.css';

const formatDuration = (start, end) => {
    if (!start || !end) return '—';
    const diff = new Date(end) - new Date(start);
    if (diff < 1000) return `${diff}ms`;
    const h = Math.floor(diff / 3600000).toString().padStart(2, '0');
    const m = Math.floor((diff % 3600000) / 60000).toString().padStart(2, '0');
    const s = Math.floor((diff % 60000) / 1000).toString().padStart(2, '0');
    return `${h}:${m}:${s}`;
};

const ExecutionLogsModal = ({ executionId, onClose }) => {
    const [logs, setLogs] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (executionId) loadLogs();
    }, [executionId]);

    const loadLogs = async () => {
        setLoading(true);
        try {
            const data = await executionService.getLogs(executionId);
            setLogs(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error('Failed to load logs', error);
            setLogs([]);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
            <div className="logs-modal shadow-xl" style={{
                background: 'var(--bg-card)',
                border: '1px solid var(--border)',
                borderRadius: '16px',
                display: 'flex',
                flexDirection: 'column',
                maxHeight: '85vh',
                overflow: 'hidden',
            }}>
                {/* Header */}
                <div style={{
                    padding: '16px 24px',
                    borderBottom: '1px solid var(--border)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    background: 'rgba(255,255,255,0.02)',
                    flexShrink: 0,
                }}>
                    <div>
                        <h3 style={{ fontSize: '15px', fontWeight: '700', color: 'var(--text-primary)', margin: 0 }}>
                            Execution Logs
                        </h3>
                        <span style={{ fontSize: '11px', color: 'var(--text-muted)', fontFamily: 'monospace', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                            #{(executionId || '').toString().substring(0, 8)}
                        </span>
                    </div>
                    <button
                        onClick={onClose}
                        style={{
                            background: 'none', border: 'none', cursor: 'pointer',
                            color: 'var(--text-muted)', fontSize: '20px', lineHeight: 1,
                            padding: '4px 8px', borderRadius: '6px',
                        }}
                    >
                        ×
                    </button>
                </div>

                {/* Body */}
                <div style={{ flexGrow: 1, overflowY: 'auto', padding: '16px 24px' }}>
                    {loading ? (
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '48px 0' }}>
                            <div style={{
                                width: '32px', height: '32px',
                                border: '3px solid rgba(88, 166, 255, 0.2)',
                                borderTopColor: 'var(--primary)',
                                borderRadius: '50%',
                                animation: 'spin 1s linear infinite',
                            }} />
                        </div>
                    ) : logs.length === 0 ? (
                        <div style={{ textAlign: 'center', padding: '48px 0', color: 'var(--text-secondary)', fontSize: '14px' }}>
                            No log entries found for this execution.
                        </div>
                    ) : (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                            {logs.map((log, index) => (
                                <div key={log.id || index} className="log-card" style={{
                                    padding: '16px',
                                    borderRadius: '10px',
                                    border: `1px solid ${log.status === 'FAILED' ? 'rgba(218,54,51,0.3)' : 'var(--border)'}`,
                                    background: log.status === 'FAILED' ? 'var(--bg-error)' : 'var(--bg-secondary)',
                                }}>
                                    {/* Log header */}
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                                        <div>
                                            <h4 style={{ fontSize: '13px', fontWeight: '700', color: 'var(--primary)', margin: '0 0 4px' }}>
                                                [Step {index + 1}] {log.stepName || 'System'}
                                            </h4>
                                            <span className="badge badge-info" style={{ fontSize: '10px' }}>
                                                {log.stepType || 'TASK'}
                                            </span>
                                        </div>
                                        <div style={{ textAlign: 'right' }}>
                                            <span className={`badge ${log.status === 'COMPLETED' ? 'badge-success' : log.status === 'FAILED' ? 'badge-error' : 'badge-warning'}`}>
                                                {log.status}
                                            </span>
                                            <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '4px', fontFamily: 'monospace' }}>
                                                {formatDuration(log.startedAt, log.endedAt)}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Rules evaluated */}
                                    {log.evaluatedRules && log.evaluatedRules.length > 0 && (
                                        <div className="rules-eval" style={{
                                            marginBottom: '8px', padding: '10px 12px',
                                            borderRadius: '8px', background: 'rgba(0,0,0,0.4)',
                                            border: '1px solid var(--border)',
                                        }}>
                                            <div style={{ fontSize: '10px', fontWeight: '700', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '8px' }}>
                                                Rules Evaluated:
                                            </div>
                                            {log.evaluatedRules.map((evalItem, idx) => (
                                                <div key={idx} style={{ display: 'flex', gap: '8px', fontSize: '12px', marginBottom: '4px' }}>
                                                    <span style={{ color: evalItem.result ? '#3fb950' : 'var(--text-muted)', flexShrink: 0 }}>
                                                        {evalItem.result ? '✓' : '✗'}
                                                    </span>
                                                    <code style={{ color: '#a5acb3', background: 'transparent' }}>
                                                        {evalItem.rule || evalItem.condition}
                                                    </code>
                                                    <span style={{ marginLeft: 'auto', color: 'var(--text-muted)', flexShrink: 0 }}>
                                                        → {evalItem.result ? 'TRUE' : 'FALSE'}
                                                    </span>
                                                </div>
                                            ))}
                                        </div>
                                    )}

                                    {/* Next step */}
                                    {log.selectedNextStepId && (
                                        <div style={{ fontSize: '12px', marginBottom: '4px' }}>
                                            <span style={{ color: 'var(--text-muted)' }}>Next Step: </span>
                                            <span style={{ color: 'var(--info)' }}>{log.selectedNextStepId}</span>
                                        </div>
                                    )}

                                    {/* Error message */}
                                    {log.errorMessage && (
                                        <div style={{
                                            fontSize: '12px', color: 'var(--error)', marginTop: '8px',
                                            paddingTop: '8px', borderTop: '1px solid rgba(218,54,51,0.2)',
                                        }}>
                                            <strong>Error:</strong> {log.errorMessage}
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div style={{
                    padding: '12px 24px',
                    borderTop: '1px solid var(--border)',
                    display: 'flex',
                    justifyContent: 'flex-end',
                    gap: '10px',
                    background: 'rgba(255,255,255,0.02)',
                    flexShrink: 0,
                }}>
                    <button className="btn btn-secondary" onClick={onClose}>Close</button>
                    <button className="btn btn-primary" onClick={loadLogs}>Refresh</button>
                </div>
            </div>
        </div>
    );
};

export default ExecutionLogsModal;
