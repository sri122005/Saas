import React, { useState, useEffect } from 'react';
import DashboardCard from '../components/DashboardCard';
import { GitFork, Activity, Play } from 'lucide-react';

const TenantDashboard = () => {
    const [stats, setStats] = useState({ workflows: 0, activeExecutions: 0 });

    useEffect(() => {
        loadStats();
    }, []);

    const loadStats = async () => {
        try {
            const workflows = await workflowService.getAll();
            const executions = await executionService.getAll();
            const workflowList = Array.isArray(workflows) ? workflows : [];
            const executionList = Array.isArray(executions) ? executions : [];
            const active = executionList.filter(e => e.status === 'IN_PROGRESS' || e.status === 'RUNNING').length;
            setStats({ 
                workflows: workflowList.length, 
                activeExecutions: active
            });
        } catch (error) {
            console.error("Failed to load tenant stats", error);
        }
    };

    return (
        <div className="animate-fade-in">
            <div className="page-header">
                <div>
                    <h1 className="page-title">Tenant Hub</h1>
                    <p className="text-secondary small mt-1">Manage your team's automation and workflows.</p>
                </div>
            </div>

            <div className="section">
                <div className="grid grid-3 mb-5">
                    <DashboardCard 
                        title="My Workflows" 
                        value={stats.workflows} 
                        icon={<GitFork size={18} />} 
                        color="var(--primary)" 
                    />
                    <DashboardCard 
                        title="Active Runs" 
                        value={stats.activeExecutions} 
                        icon={<Play size={18} />} 
                        color="var(--warning)" 
                    />
                    <DashboardCard 
                        title="Platform Health" 
                        value="99.9%" 
                        icon={<Activity size={18} />} 
                        color="var(--success)" 
                    />
                </div>
            </div>
        </div>
    );
};

export default TenantDashboard;
