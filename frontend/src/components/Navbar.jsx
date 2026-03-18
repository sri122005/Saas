import React from 'react';
import { useAuth } from '../context/AuthContext';
import { GitFork, UserCircle } from 'lucide-react';

const Navbar = () => {
  const { user } = useAuth();

  return (
    <header className="navbar">
      <div className="navbar-inner">
        {/* Logo: Left */}
        <div className="navbar-logo">
          <div className="navbar-logo-icon">
            <GitFork size={18} strokeWidth={2.5} />
          </div>
          <span className="navbar-logo-text">HALLEYX</span>
        </div>

        {/* Nav Links: Center (landing page links) */}
        {!user && (
          <nav>
            <ul className="navbar-links">
              <li><a href="#features">Features</a></li>
              <li><a href="#how-it-works">How it works</a></li>
              <li><a href="#pricing">Pricing</a></li>
            </ul>
          </nav>
        )}

        {/* CTA / User Profile: Right */}
        <div className="navbar-actions">
          {user ? (
            <div className="navbar-user">
              <div className="navbar-user-info">
                <span className="navbar-user-name">{user.name || 'User'}</span>
                <span className="navbar-user-role">{user.role || 'Guest'}</span>
              </div>
              <div className="navbar-avatar">
                <UserCircle size={22} strokeWidth={1.5} />
              </div>
            </div>
          ) : (
            <a href="/login" className="btn btn-secondary" style={{ textDecoration: 'none' }}>
              Sign In
            </a>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
