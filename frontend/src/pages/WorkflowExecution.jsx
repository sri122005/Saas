import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { workflowService, executionService } from '../services/api/workflowApi';
import { Play, CheckCircle, XCircle, Clock, Activity, FileText, ChevronRight, Info, AlertCircle, Settings, ArrowLeft } from 'lucide-react';

const WorkflowExecution = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [workflow, setWorkflow] = useState(null);
    const [execution, setExecution] = useState(null);
    const [logs, setLogs] = useState([]);
    const [formData, setFormData] = useState({});
    const [loading, setLoading] = useState(true);
    const [executing, setExecuting] = useState(false);
    const [error, setError] = useState(null);
    const pollInterval = useRef(null);

    useEffect(() => {
        loadWorkflow();
        return () => {
            if (pollInterval.current) clearInterval(pollInterval.current);
        };
    }, [id]);

    const loadWorkflow = async () => {
        try {
            const data = await workflowService.getById(id);
            setWorkflow(data);
            const initialData = {};
            if (data.inputSchema) {
                Object.keys(data.inputSchema).forEach(key => {
                    initialData[key] = data.inputSchema[key].default || '';
                });
            }
            setFormData(initialData);
        } catch (err) {
            setError("Failed to load workflow details.");
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (field, value) => {
        setFormData({ ...formData, [field]: value });
    };

    const startExecution = async () => {
        setExecuting(true);
        setError(null);
        try {
            const data = await executionService.start(id, formData);
            setExecution(data);
            startPolling(data.id);
        } catch (err) {
            setError("Workflow execution failed to initialize.");
            console.error(err);
            setExecuting(false);
        }
    };

    const startPolling = (executionId) => {
        if (pollInterval.current) clearInterval(pollInterval.current);
        pollInterval.current = setInterval(async () => {
            try {
                const [execData, logsData] = await Promise.all([
                    executionService.getById(executionId),
                    executionService.getLogs(executionId)
                ]);
                setExecution(execData);
                setLogs(logsData);

                if (execData.status === 'COMPLETED' || execData.status === 'FAILED') {
                    clearInterval(pollInterval.current);
                }
            } catch (err) {
                console.error("Polling error:", err);
            }
        }, 2000);
    };

    const formatDuration = (start, end) => {
        if (!start || !end) return '00:00:00';
        const diff = new Date(end) - new Date(start);
        const h = Math.floor(diff / 3600000).toString().padStart(2, '0');
        const m = Math.floor((diff % 3600000) / 60000).toString().padStart(2, '0');
        const s = Math.floor((diff % 60000) / 1000).toString().padStart(2, '0');
        return `${h}:${m}:${s}`;
    };

    if (loading) return (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '80px 0', gap: '16px' }}>
            <div style={{
                width: '32px', height: '32px',
                border: '2px solid var(--border)',
                borderTopColor: 'var(--primary)',
                borderRadius: '50%',
                animation: 'spin 0.8s linear infinite'
            }} />
            <p style={{ fontSize: '11px', fontWeight: '600', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.15em' }}>Initializing...</p>
        </div>
    );

    if (!workflow) return (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '80px 24px', textAlign: 'center', gap: '16px' }}>
            <div style={{ width: '56px', height: '56px', borderRadius: 'var(--radius-md)', background: 'var(--error-dim)', border: '1px solid rgba(220,38,38,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#f87171' }}>
                <AlertCircle size={28} strokeWidth={1.5} />
            </div>
            <h2 style={{ fontSize: '18px', fontWeight: '700', color: 'var(--text-primary)', margin: 0 }}>{error || 'Workflow Not Found'}</h2>
            <p style={{ fontSize: '13px', color: 'var(--text-secondary)', maxWidth: '280px', lineHeight: 1.6 }}>The requested automation sequence could not be located.</p>
            <button className="btn btn-secondary icon-row" onClick={() => navigate('/workflows')}>
                <ArrowLeft size={15} />
                Back to Workflows
            </button>
        </div>
    );

    return (
        <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
            <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: '16px', flexWrap: 'wrap' }}>
                <div className="icon-row" style={{ gap: '16px' }}>
                    <div style={{ width: '48px', height: '48px', borderRadius: '16px', background: 'rgba(88, 166, 255, 0.1)', border: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Activity size={24} style={{ color: 'var(--primary)', animation: 'pulse 2s infinite' }} />
                    </div>
                    <div>
                        <h1 style={{ fontSize: '28px', fontWeight: '900', letterSpacing: '-0.03em', color: 'var(--text-primary)', fontStyle: 'italic' }}>Execution Hub</h1>
                        <p style={{ color: 'var(--text-secondary)', marginTop: '4px', fontSize: '14px' }}>Launch and monitor enterprise automation instances in real-time.</p>
                    </div>
                </div>
                <button 
                    className="btn btn-secondary icon-row"
                    onClick={() => navigate('/workflows')}
                >
                    <ArrowLeft size={16} />
                    Return to Hub
                </button>
            </div>

            <div className="grid grid-2" style={{ gridTemplateColumns: 'minmax(350px, 1fr) 2fr', alignItems: 'start' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
                    <div className="card">
                        <div style={{ padding: '20px 32px', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: '12px', background: 'rgba(255,255,255,0.02)' }}>
                            <Settings size={18} style={{ color: 'var(--text-muted)' }} />
                            <h3 style={{ fontSize: '12px', fontWeight: '900', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--text-secondary)' }}>Input Configuration</h3>
                        </div>
                        
                        <div style={{ padding: '32px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
                            <div style={{ padding: '16px', borderRadius: '16px', background: 'rgba(1, 4, 9, 0.5)', border: '1px solid var(--border)', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                                <span style={{ fontSize: '10px', fontWeight: '900', color: 'var(--text-muted)', letterSpacing: '0.2em', textTransform: 'uppercase' }}>Active Template</span>
                                <span style={{ fontSize: '18px', fontWeight: '700', color: '#fff' }}>{workflow.name}</span>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '4px' }}>
                                    <span className="badge badge-info">v{workflow.version || 1}</span>
                                    <span style={{ fontSize: '10px', fontWeight: '900', letterSpacing: '0.1em', textTransform: 'uppercase', color: workflow.isActive ? '#3fb950' : '#d29922' }}>
                                        {workflow.isActive ? 'Production Ready' : 'Development Draft'}
                                    </span>
                                </div>
                            </div>

                            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                                {workflow.inputSchema && Object.entries(workflow.inputSchema).map(([field, config]) => (
                                    <div key={field} className="form-group">
                                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                                            <label className="form-label" style={{ marginBottom: 0 }}>{field}</label>
                                            <span style={{ fontSize: '10px', fontWeight: '700', color: 'var(--primary)', background: 'rgba(88, 166, 255, 0.05)', padding: '2px 8px', borderRadius: '6px', textTransform: 'uppercase' }}>{config.type}</span>
                                        </div>
                                        
                                        {config.allowed_values ? (
                                            <select 
                                                className="form-control"
                                                value={formData[field]}
                                                onChange={(e) => handleInputChange(field, e.target.value)}
                                                style={{ appearance: 'none' }}
                                            >
                                                <option value="">Select option...</option>
                                                {config.allowed_values.map(v => <option key={v} value={v}>{v}</option>)}
                                            </select>
                                        ) : (
                                            <input 
                                                type={config.type === 'number' ? 'number' : 'text'}
                                                className="form-control"
                                                placeholder={`Value for ${field}...`}
                                                value={formData[field]}
                                                onChange={(e) => handleInputChange(field, e.target.value)}
                                            />
                                        )}
                                        {config.required && <p style={{ fontSize: '10px', color: 'var(--text-muted)', fontStyle: 'italic', marginTop: '4px' }}>* Mandatory field</p>}
                                    </div>
                                ))}

                                <button 
                                    className="btn btn-primary btn-full" 
                                    style={{ height: '48px', marginTop: '16px' }}
                                    onClick={startExecution}
                                    disabled={executing || (execution && (execution.status === 'RUNNING' || execution.status === 'WAITING_FOR_APPROVAL'))}
                                >
                                    {executing ? (
                                        <div className="icon-row">
                                            <div style={{ width: '16px', height: '16px', border: '2px solid rgba(255,255,255,0.2)', borderTopColor: '#fff', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div>
                                            <span>Initializing...</span>
                                        </div>
                                    ) : (
                                        <div className="icon-row">
                                            <Play size={18} fill="currentColor" strokeWidth={3} />
                                            <span>Launch Instance</span>
                                        </div>
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>

                    {execution && (
                        <div className="card animate-fade-in">
                            <div style={{ padding: '20px 32px', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'rgba(255,255,255,0.02)' }}>
                                <div className="icon-row">
                                    <Activity size={18} style={{ color: 'var(--primary)' }} />
                                    <h3 style={{ fontSize: '12px', fontWeight: '900', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--text-secondary)' }}>Runtime Monitor</h3>
                                </div>
                                <span className={`badge ${
                                    execution.status === 'COMPLETED' ? 'badge-success' : 
                                    execution.status === 'FAILED' ? 'badge-danger' : 
                                    'badge-info'
                                }`}>
                                    {execution.status}
                                </span>
                            </div>

                            <div style={{ padding: '32px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '16px', padding: '16px', borderRadius: '16px', background: 'rgba(1, 4, 9, 0.5)', border: '1px solid var(--border)' }}>
                                    <div style={{ width: '40px', height: '40px', borderRadius: '12px', background: 'rgba(88, 166, 255, 0.1)', border: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary)' }}>
                                        <Settings size={20} />
                                    </div>
                                    <div>
                                        <p style={{ fontSize: '10px', fontWeight: '900', color: 'var(--text-muted)', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '2px' }}>Active Logic Node</p>
                                        <p style={{ fontWeight: '700', color: '#fff', fontSize: '16px', margin: 0 }}>{execution.currentStepName || 'Waiting for first step...'}</p>
                                    </div>
                                </div>

                                {execution.status === 'WAITING_FOR_APPROVAL' && (
                                    <div style={{ padding: '16px', borderRadius: '16px', background: 'rgba(210, 153, 34, 0.1)', border: '1px solid rgba(210, 153, 34, 0.2)', color: '#d29922', display: 'flex', gap: '16px', alignItems: 'center', animation: 'pulse 2s infinite' }}>
                                        <div style={{ width: '40px', height: '40px', borderRadius: '12px', background: 'rgba(210, 153, 34, 0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                            <Info size={20} />
                                        </div>
                                        <p style={{ fontSize: '12px', fontWeight: '700', lineHeight: '1.5', margin: 0 }}>Awaiting high-priority manual approval to continue execution logic.</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </div>

                {/* Right Column: Terminal Logs */}
                <div style={{ height: '100%' }}>
                    <div className="card" style={{ background: '#0d1117', border: '1px solid var(--border)', borderRadius: '32px', overflow: 'hidden', display: 'flex', flexDirection: 'column', height: '800px', position: 'relative' }}>
                        <div style={{ position: 'absolute', top: 0, right: 0, padding: '128px', background: 'var(--primary)', opacity: 0.05, filter: 'blur(100px)', borderRadius: '50%', transform: 'translate(50%, -50%)' }}></div>
                        
                        <div style={{ padding: '20px 32px', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'relative', zIndex: 10, background: 'rgba(22, 27, 34, 0.8)', backdropFilter: 'blur(12px)' }}>
                            <div className="icon-row">
                                <div style={{ display: 'flex', gap: '6px', marginRight: '8px' }}>
                                    <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#da3633', opacity: 0.3, border: '1px solid rgba(218, 54, 51, 0.5)' }}></div>
                                    <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#d29922', opacity: 0.3, border: '1px solid rgba(210, 153, 34, 0.5)' }}></div>
                                    <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#3fb950', opacity: 0.3, border: '1px solid rgba(63, 185, 80, 0.5)' }}></div>
                                </div>
                                <h3 style={{ fontSize: '12px', fontWeight: '900', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--text-secondary)' }}>Execution Stack Data</h3>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                                {logs.length > 0 && (
                                    <span style={{ fontSize: '10px', fontWeight: '900', color: 'var(--primary)', letterSpacing: '0.1em', textTransform: 'uppercase', background: 'rgba(88, 166, 255, 0.1)', padding: '4px 12px', borderRadius: '20px', border: '1px solid rgba(88, 166, 255, 0.2)', fontVariantNumeric: 'tabular-nums' }}>
                                        {logs.length} Events Logged
                                    </span>
                                )}
                                <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#3fb950', animation: 'pulse 1s infinite' }}></div>
                            </div>
                        </div>

                        <div style={{ flex: 1, overflowY: 'auto', padding: '32px', position: 'relative', zIndex: 1, fontFamily: 'var(--font-mono)' }}>
                            {logs.length === 0 ? (
                                <div style={{ height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', opacity: 0.4, padding: '80px 0' }}>
                                    <div style={{ width: '96px', height: '96px', borderRadius: '50%', background: 'rgba(110, 118, 129, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '24px' }}>
                                        <FileText size={48} strokeWidth={1} style={{ color: 'var(--text-secondary)' }} />
                                    </div>
                                    <p style={{ fontSize: '14px', fontWeight: '700', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.2em', lineHeight: '1.6' }}>
                                        Awaiting trigger signal...<br />
                                        Terminal logs will initialize upon launch.
                                    </p>
                                </div>
                            ) : (
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                                    {logs.map((log, index) => (
                                        <div key={log.id} style={{ display: 'flex', gap: '24px', animation: 'fadeIn 0.5s ease-out' }}>
                                            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px', paddingTop: '4px' }}>
                                                <div style={{ 
                                                    width: '40px', height: '40px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid var(--border)',
                                                    background: log.status === 'COMPLETED' ? 'rgba(63, 185, 80, 0.1)' : log.status === 'FAILED' ? 'rgba(218, 54, 51, 0.1)' : 'rgba(88, 166, 255, 0.1)',
                                                    color: log.status === 'COMPLETED' ? '#3fb950' : log.status === 'FAILED' ? '#da3633' : 'var(--primary)'
                                                }}>
                                                    {log.status === 'COMPLETED' ? <CheckCircle size={18} /> : log.status === 'FAILED' ? <XCircle size={18} /> : <Clock size={18} />}
                                                </div>
                                                {index < logs.length - 1 && <div style={{ width: '1px', flex: 1, background: 'rgba(110, 118, 129, 0.2)', minHeight: '40px' }}></div>}
                                            </div>

                                            <div style={{ flex: 1, background: 'rgba(22, 27, 34, 0.5)', border: '1px solid var(--border)', padding: '20px', borderRadius: '20px', transition: 'all 0.3s ease' }}>
                                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '16px' }}>
                                                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                                                        <span style={{ fontSize: '10px', fontWeight: '900', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '4px' }}>Step Name</span>
                                                        <span style={{ fontWeight: '700', color: '#fff', fontSize: '16px' }}>{log.stepName}</span>
                                                    </div>
                                                    <div style={{ background: 'rgba(1, 4, 9, 0.5)', padding: '6px 12px', borderRadius: '8px', border: '1px solid var(--border)', fontWeight: '700', fontSize: '10px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.1em', fontVariantNumeric: 'tabular-nums' }}>
                                                        {formatDuration(log.startedAt, log.endedAt)}
                                                    </div>
                                                </div>
                                                
                                                {log.evaluatedRules && log.evaluatedRules.length > 0 && (
                                                    <div style={{ marginTop: '16px', paddingTop: '16px', borderTop: '1px solid rgba(110, 118, 129, 0.2)', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                                        <span style={{ fontSize: '10px', fontWeight: '900', color: 'var(--primary)', textTransform: 'uppercase', letterSpacing: '0.1em', opacity: 0.6 }}>Decision Matrix</span>
                                                        <div style={{ background: 'rgba(1, 4, 9, 0.8)', padding: '12px', borderRadius: '12px', border: '1px solid rgba(63, 185, 80, 0.2)', fontSize: '12px', fontWeight: '700', color: '#3fb950', wordBreak: 'break-all', lineHeight: '1.6', letterSpacing: '-0.02em' }}>
                                                            NEXT &rarr; {log.selectedNextStepId || 'SYSTEM_TERMINATE'}
                                                        </div>
                                                    </div>
                                                )}
                                                
                                                <div style={{ display: 'flex', itemsCenter: 'center', gap: '24px', marginTop: '24px', paddingTop: '16px', borderTop: '1px solid rgba(110, 118, 129, 0.1)' }}>
                                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                                        <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'rgba(88, 166, 255, 0.4)' }}></span>
                                                        <span style={{ fontSize: '10px', fontWeight: '900', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>{log.status}</span>
                                                    </div>
                                                    {log.approverId && (
                                                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                                            <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'rgba(63, 185, 80, 0.4)' }}></span>
                                                            <span style={{ fontSize: '10px', fontWeight: '900', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Verified by {log.approverId}</span>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
            
            {error && (
                <div style={{ position: 'fixed', bottom: '32px', left: '50%', transform: 'translateX(-50%)', zIndex: 100, width: '100%', maxWidth: '400px', padding: '0 16px', animation: 'fadeIn 0.5s ease-out' }}>
                    <div style={{ background: '#da3633', color: '#fff', padding: '16px', borderRadius: '16px', boxShadow: '0 20px 40px rgba(0,0,0,0.4)', display: 'flex', alignItems: 'center', gap: '16px', border: '1px solid rgba(255,255,255,0.2)' }}>
                        <div style={{ background: 'rgba(255,255,255,0.2)', padding: '8px', borderRadius: '12px' }}>
                            <AlertCircle size={20} />
                        </div>
                        <p style={{ fontSize: '14px', fontWeight: '700', margin: 0 }}>{error}</p>
                    </div>
                </div>
            )}
        </div>
    );
};

export default WorkflowExecution;
