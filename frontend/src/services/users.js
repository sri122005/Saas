import api from './api';

export const userService = {
  getAllUsers: async () => {
    return api.get('/users');
  },

  createUser: async (userData) => {
    return api.post('/users', userData);
  }
};
