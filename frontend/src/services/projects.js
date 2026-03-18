import api from './api';

export const projectService = {
  getAllProjects: async () => {
    return api.get('/projects');
  },

  createProject: async (projectData) => {
    return api.post('/projects', projectData);
  }
};
