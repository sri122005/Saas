import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { userService } from '../services/users';
import { workflowService } from '../services/api/workflowApi';
import { Users, Activity, GitFork, ScrollText, Plus, PlayCircle } from 'lucide-react';
import DashboardCard from '../components/DashboardCard';

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState({ users: 0, workflows: 0, executions: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [usersRes, workflowsRes] = await Promise.all([
          userService.getAllUsers(),
          workflowService.getAll()
        ]);
        setStats({
          users: (usersRes || []).length,
          workflows: (workflowsRes || []).length,
          executions: 0
        });
      } catch (err) {
        console.error("Failed to fetch dashboard stats", err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
      {/* Page Header */}
      <div className="page-header">
        <div>
          <h1 className="page-title">Workspace Overview</h1>
          <p className="page-subtitle">Monitor your automation performance in real-time.</p>
        </div>
        <button className="btn btn-primary icon-row" onClick={() => navigate('/workflows/new')}>
          <Plus size={15} />
          New Workflow
        </button>
      </div>

      {/* Stats Grid */}
      {loading ? (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '80px 0' }}>
          <div style={{
            width: '32px', height: '32px',
            border: '2px solid var(--border)',
            borderTopColor: 'var(--primary)',
            borderRadius: '50%',
            animation: 'spin 0.8s linear infinite'
          }} />
        </div>
      ) : (
        <>
          <div className="grid grid-3">
            <DashboardCard
              title="Workflows"
              value={stats.workflows}
              icon={<GitFork size={16} />}
              color="var(--primary)"
            />
            <DashboardCard
              title="Executions"
              value={stats.executions}
              icon={<PlayCircle size={16} />}
              color="#3fb950"
            />
            <DashboardCard
              title="Total Users"
              value={stats.users}
              icon={<Users size={16} />}
              color="#e3b341"
            />
          </div>

          {/* Activity Log Panel */}
          <div className="card">
            <div className="card-header">
              <span className="card-header-label icon-row">
                <Activity size={13} style={{ color: 'var(--primary)' }} />
                System Activity Log
              </span>
              <button
                className="btn-ghost-sm"
                onClick={() => navigate('/audit-logs')}
              >
                View all logs
              </button>
            </div>
            <div className="card-empty">
              <div className="card-empty-icon">
                <ScrollText size={24} strokeWidth={1.5} />
              </div>
              <div>
                <p className="card-empty-title">All systems go</p>
                <p className="card-empty-desc">No automated executions tracked in the last 24h.</p>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Dashboard;
