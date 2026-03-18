import React, { useState, useEffect } from 'react';
import DashboardCard from '../components/DashboardCard';
import { workflowService, executionService } from '../services/api/workflowApi';
import { Users, Building2, Shield, DollarSign } from 'lucide-react';

const AdminDashboard = () => {
    const [stats, setStats] = useState({ workflows: 0, executions: 0, failed: 0 });

    useEffect(() => {
        loadStats();
    }, []);

    const loadStats = async () => {
        try {
            const workflows = await workflowService.getAll();
            const executions = await executionService.getAll();
            const workflowList = Array.isArray(workflows) ? workflows : [];
            const executionList = Array.isArray(executions) ? executions : [];
            const failed = executionList.filter(e => e.status === 'FAILED').length;
            setStats({ 
                workflows: workflowList.length, 
                executions: executionList.length,
                failed: failed
            });
        } catch (error) {
            console.error("Failed to load admin stats", error);
        }
    };

    return (
        <div className="animate-fade-in">
            <div className="page-header">
                <h1 className="page-title">Admin Console</h1>
                <div className="header-actions">
                    <button className="btn btn-secondary btn-sm" onClick={loadStats}>Refresh Stats</button>
                </div>
            </div>

            <div className="section">
                <div className="grid grid-3 mb-5">
                    <DashboardCard 
                        title="Workflows" 
                        value={stats.workflows} 
                        icon={<Shield size={18} />} 
                        color="var(--primary)" 
                    />
                    <DashboardCard 
                        title="Total Executions" 
                        value={stats.executions} 
                        icon={<Building2 size={18} />} 
                        color="var(--success)" 
                    />
                    <DashboardCard 
                        title="Failed Instances" 
                        value={stats.failed} 
                        icon={<Users size={18} />} 
                        color="var(--error)" 
                    />
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
