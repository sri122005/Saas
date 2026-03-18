import React from 'react';
import { useAuth } from '../context/AuthContext';
import { UserCircle } from 'lucide-react';
import './AppHeader.css';

const AppHeader = () => {
  const { user } = useAuth();

  return (
    <header className="app-header">
      <div className="app-header-right">
        {user && (
          <div className="app-header-user">
            <div className="app-header-user-info">
              <span className="app-header-name">{user.name || 'User'}</span>
              <span className="app-header-role">{user.role || 'Guest'}</span>
            </div>
            <div className="app-header-avatar">
              <UserCircle size={20} strokeWidth={1.5} />
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default AppHeader;
