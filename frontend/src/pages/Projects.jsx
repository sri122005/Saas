import React, { useState, useEffect } from 'react';
import { projectService } from '../services/projects';
import { Plus } from 'lucide-react';

const Projects = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ name: '', description: '' });
  const [submitLoading, setSubmitLoading] = useState(false);

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    setLoading(true);
    try {
      const data = await projectService.getAllProjects();
      setProjects(data);
    } catch (err) {
      console.error("Failed to fetch projects", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitLoading(true);
    try {
      await projectService.createProject(formData);
      setFormData({ name: '', description: '' });
      setShowForm(false);
      fetchProjects();
    } catch (err) {
      console.error("Failed to create project", err);
    } finally {
      setSubmitLoading(false);
    }
  };

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
      <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: '16px', flexWrap: 'wrap' }}>
        <div>
          <h1 style={{ fontSize: '28px', fontWeight: '900', letterSpacing: '-0.03em', color: 'var(--text-primary)', fontStyle: 'italic' }}>Projects</h1>
          <p style={{ color: 'var(--text-secondary)', marginTop: '4px', fontSize: '14px' }}>Manage and monitor all automation initiatives across your organization.</p>
        </div>
        <button 
          className="btn btn-primary icon-row"
          onClick={() => setShowForm(!showForm)}
        >
          <Plus size={16} strokeWidth={3} />
          New Project
        </button>
      </div>

      {showForm && (
        <div className="card" style={{ padding: '32px', position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', top: 0, right: 0, padding: '48px', background: 'var(--primary)', opacity: 0.1, filter: 'blur(60px)', borderRadius: '50%', transform: 'translate(50%, -50%)' }}></div>
          <div style={{ position: 'relative', zIndex: 1 }}>
            <h3 style={{ fontSize: '18px', fontWeight: '700', marginBottom: '24px' }}>Create New Project</h3>
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              <div className="grid grid-2">
                <div className="form-group">
                  <label className="form-label">Project Name</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="e.g. Marketing Automation"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Identifier (Auto-generated)</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="PROJ-001"
                    disabled
                    style={{ opacity: 0.5, cursor: 'not-allowed' }}
                  />
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">Description</label>
                <textarea
                  className="form-control"
                  style={{ minHeight: '100px' }}
                  placeholder="Describe the purpose of this project..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                ></textarea>
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
                  {submitLoading ? 'Creating...' : 'Create Project'}
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
        ) : projects.length === 0 ? (
          <div style={{ padding: '128px 0', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: '16px' }}>
            <div style={{ width: '80px', height: '80px', borderRadius: '24px', background: 'var(--bg-main)', border: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'rgba(110, 118, 129, 0.1)' }}>
              <FolderKanban size={48} strokeWidth={1} />
            </div>
            <p style={{ color: 'var(--text-secondary)', fontWeight: '500', maxWidth: '320px', padding: '0 16px' }}>No projects found. Create your first project to get started.</p>
          </div>
        ) : (
          <div className="table-responsive">
            <table className="modern-table">
              <thead>
                <tr>
                  <th>Project Entity</th>
                  <th>Status</th>
                  <th>Description</th>
                  <th style={{ textAlign: 'right' }}>Date Created</th>
                </tr>
              </thead>
              <tbody>
                {(Array.isArray(projects) ? projects : []).map((project) => (
                  <tr key={project.id}>
                    <td>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                        <span style={{ fontWeight: '700', color: 'var(--text-primary)' }}>{project.name}</span>
                        <span style={{ fontSize: '10px', fontWeight: '900', color: 'var(--text-muted)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>ID: {project.id}</span>
                      </div>
                    </td>
                    <td>
                      <span className="badge badge-success" style={{ gap: '6px' }}>
                        <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#3fb950', animation: 'fadeIn 1s infinite alternate' }}></span>
                        Active
                      </span>
                    </td>
                    <td style={{ color: 'var(--text-secondary)', fontSize: '14px', maxWidth: '320px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {project.description || <span style={{ opacity: 0.2 }}>—</span>}
                    </td>
                    <td style={{ textAlign: 'right', fontWeight: '500', color: 'var(--text-secondary)', fontVariantNumeric: 'tabular-nums', fontSize: '12px' }}>
                      {new Date(project.createdAt).toLocaleDateString(undefined, {
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

export default Projects;
