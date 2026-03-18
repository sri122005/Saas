import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { 
    LayoutDashboard, 
    Users, 
    LogOut, 
    GitFork,
    PlayCircle, 
    ScrollText 
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import './Sidebar.css';

const Sidebar = ({ className }) => {
  const location = useLocation();
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navItems = [
    { path: '/dashboard', icon: <LayoutDashboard size={20} />, label: 'Dashboard' },
    { path: '/users', icon: <Users size={20} />, label: 'Users' },
    { path: '/workflows', icon: <GitFork size={20} />, label: 'Workflows' },
    { path: '/executions', icon: <PlayCircle size={20} />, label: 'Executions' },
    { path: '/audit-logs', icon: <ScrollText size={20} />, label: 'Audit Logs' },
  ];

  return (
    <aside className={`sidebar ${className || ''}`}>
      <div className="sidebar-brand">
        <h1 className="brand-text">HALLEYX</h1>
      </div>
      
      <div className="sidebar-content">
        <nav className="sidebar-nav">
          <div className="nav-section-label">Navigation</div>
          <ul>
            {navItems.map((item) => (
              <li key={item.path}>
                <Link
                  to={item.path}
                  className={`nav-item ${location.pathname === item.path ? 'active' : ''}`}
                >
                  <span className="nav-icon">{item.icon}</span>
                  <span className="nav-label">{item.label}</span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>

      <div className="sidebar-footer">
        <button onClick={handleLogout} className="logout-btn">
          <LogOut size={16} />
          <span>Sign Out</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
