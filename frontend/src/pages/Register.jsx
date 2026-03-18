import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Auth.css';

const Register = () => {
  const [tenantName, setTenantName] = useState('');
  const [adminName, setAdminName] = useState('');
  const [adminEmail, setAdminEmail] = useState('');
  const [adminPassword, setAdminPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await register(tenantName, adminName, adminEmail, adminPassword);
      navigate('/dashboard');
    } catch (err) {
      const msg = err.response?.data?.message;
      setError(typeof msg === 'string' ? msg : 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card" style={{ maxWidth: '520px' }}>
        <div className="auth-header">
          <div style={{
            width: '48px', height: '48px',
            background: 'var(--primary)',
            borderRadius: '12px',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            margin: '0 auto 16px',
            fontSize: '22px',
          }}>
            🏢
          </div>
          <h2>Create Organization</h2>
          <p>Register a new tenant workspace with Halleyx</p>
        </div>

        {error && (
          <div className="auth-error">{error}</div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div className="form-group">
            <label className="form-label">Organization Name</label>
            <input
              type="text"
              className="form-control"
              value={tenantName}
              onChange={(e) => setTenantName(e.target.value)}
              required
              placeholder="Acme Corp"
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Admin Name</label>
              <input
                type="text"
                className="form-control"
                value={adminName}
                onChange={(e) => setAdminName(e.target.value)}
                required
                placeholder="John Doe"
              />
            </div>
            <div className="form-group">
              <label className="form-label">Admin Email</label>
              <input
                type="email"
                className="form-control"
                value={adminEmail}
                onChange={(e) => setAdminEmail(e.target.value)}
                required
                placeholder="john@acme.com"
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Admin Password</label>
            <input
              type="password"
              className="form-control"
              value={adminPassword}
              onChange={(e) => setAdminPassword(e.target.value)}
              required
              minLength="6"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            className="btn btn-primary auth-btn"
            disabled={loading}
          >
            {loading ? 'Creating workspace...' : 'Register Workspace'}
          </button>
        </form>

        <div className="auth-footer">
          Already have an account?{' '}
          <Link to="/login">Sign in here</Link>
        </div>
      </div>
    </div>
  );
};

export default Register;
