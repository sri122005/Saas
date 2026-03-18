import React, { useState, useEffect } from 'react';
import { userService } from '../services/users';
import { Plus } from 'lucide-react';

const Users = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', password: '', role: 'USER' });
  const [submitLoading, setSubmitLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const data = await userService.getAllUsers();
      setUsers(data);
    } catch (err) {
      console.error("Failed to fetch users", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitLoading(true);
    setError('');
    try {
      await userService.createUser(formData);
      setFormData({ name: '', email: '', password: '', role: 'USER' });
      setShowForm(false);
      fetchUsers();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create user');
    } finally {
      setSubmitLoading(false);
    }
  };

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
      <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: '16px', flexWrap: 'wrap' }}>
        <div>
          <h1 style={{ fontSize: '28px', fontWeight: '900', letterSpacing: '-0.03em', color: 'var(--text-primary)', fontStyle: 'italic' }}>Team members</h1>
          <p style={{ color: 'var(--text-secondary)', marginTop: '4px', fontSize: '14px' }}>Manage access, roles, and security permissions for your organization.</p>
        </div>
        <button 
          className="btn btn-primary icon-row"
          onClick={() => setShowForm(!showForm)}
        >
          <Plus size={16} strokeWidth={3} />
          Invite member
        </button>
      </div>

      {showForm && (
        <div className="card" style={{ padding: '32px', position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', top: 0, right: 0, padding: '48px', background: 'var(--primary)', opacity: 0.1, filter: 'blur(60px)', borderRadius: '50%', transform: 'translate(50%, -50%)' }}></div>
          <div style={{ position: 'relative', zIndex: 1 }}>
            <h3 style={{ fontSize: '18px', fontWeight: '700', marginBottom: '24px' }}>Invite new member</h3>
            {error && (
              <div style={{ padding: '12px 16px', borderRadius: '8px', background: 'rgba(218, 54, 51, 0.1)', border: '1px solid rgba(218, 54, 51, 0.2)', color: 'var(--error)', fontSize: '14px', marginBottom: '24px' }}>
                {error}
              </div>
            )}
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              <div className="grid grid-2">
                <div className="form-group">
                  <label className="form-label">Full Name</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="e.g. John Doe"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Email address</label>
                  <input
                    type="email"
                    className="form-control"
                    placeholder="john@example.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Temporary Password</label>
                  <input
                    type="password"
                    className="form-control"
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    required
                    minLength="6"
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Access Role</label>
                  <select 
                    className="form-control"
                    value={formData.role}
                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                    style={{ appearance: 'none' }}
                  >
                    <option value="USER">Standard User</option>
                    <option value="ADMIN">Administrator</option>
                  </select>
                </div>
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '16px', paddingTop: '24px', borderTop: '1px solid var(--border)' }}>
                <button 
                  type="button" 
                  className="btn btn-secondary"
                  onClick={() => setShowForm(false)}
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="btn btn-primary"
                  disabled={submitLoading}
                >
                  {submitLoading ? 'Sending invite...' : 'Invite member'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="card" style={{ background: 'rgba(13, 17, 23, 0.3)', backdropFilter: 'blur(8px)' }}>
        {loading ? (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '96px 0' }}>
            <div style={{ width: '40px', height: '40px', border: '4px solid rgba(88, 166, 255, 0.2)', borderTopColor: 'var(--primary)', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div>
          </div>
        ) : users.length === 0 ? (
          <div style={{ padding: '128px 0', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: '16px' }}>
            <div style={{ width: '80px', height: '80px', borderRadius: '24px', background: 'var(--bg-main)', border: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'rgba(110, 118, 129, 0.1)' }}>
              <Plus size={48} strokeWidth={1} />
            </div>
            <p style={{ color: 'var(--text-secondary)', fontWeight: '500', maxWidth: '320px', padding: '0 16px' }}>No team members found. Invite your first team member to collaborate.</p>
          </div>
        ) : (
          <div className="table-responsive">
            <table className="modern-table">
              <thead>
                <tr>
                  <th>Team Member</th>
                  <th>Workspace Role</th>
                  <th style={{ textAlign: 'right' }}>Joined</th>
                </tr>
              </thead>
              <tbody>
                {(Array.isArray(users) ? users : []).map((user) => (
                  <tr key={user.id}>
                    <td>
                      <div className="icon-row">
                        <div style={{ 
                          width: '40px', height: '40px', borderRadius: '12px', 
                          background: 'rgba(88, 166, 255, 0.1)', border: '1px solid var(--border)', 
                          display: 'flex', alignItems: 'center', justifyContent: 'center', 
                          fontWeight: '700', fontSize: '14px', color: 'var(--primary)' 
                        }}>
                          {user.name.charAt(0).toUpperCase()}
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                          <span style={{ fontWeight: '700', color: 'var(--text-primary)' }}>{user.name}</span>
                          <span style={{ fontSize: '12px', color: 'var(--text-secondary)', fontStyle: 'italic' }}>{user.email}</span>
                        </div>
                      </div>
                    </td>
                    <td>
                      <span className={`badge ${user.role === 'ADMIN' ? 'badge-info' : 'badge-success'}`}>
                         {user.role}
                      </span>
                    </td>
                    <td style={{ textAlign: 'right', fontWeight: '500', color: 'var(--text-secondary)', fontVariantNumeric: 'tabular-nums', fontSize: '12px' }}>
                      {new Date(user.createdAt).toLocaleDateString(undefined, {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric'
                      })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default Users;
