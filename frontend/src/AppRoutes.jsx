import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Users from './pages/Users';
import ProtectedRoute from './components/ProtectedRoute';

// Workflow Pages
import WorkflowDashboard from './pages/WorkflowDashboard';
import ExecutionMonitor from './pages/ExecutionMonitor';
import AuditLogs from './pages/AuditLogs';
import WorkflowEditor from './pages/WorkflowEditor';
import WorkflowExecution from './pages/WorkflowExecution';

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      
      <Route element={<ProtectedRoute />}>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/workflows" element={<WorkflowDashboard />} />
        <Route path="/workflows/new" element={<WorkflowEditor />} />
        <Route path="/workflows/:id" element={<WorkflowEditor />} />
        <Route path="/workflows/:id/execute" element={<WorkflowExecution />} />
        <Route path="/executions" element={<ExecutionMonitor />} />
        <Route path="/audit-logs" element={<AuditLogs />} />
        <Route path="/users" element={<Users />} />
      </Route>
      
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}

export default AppRoutes;
