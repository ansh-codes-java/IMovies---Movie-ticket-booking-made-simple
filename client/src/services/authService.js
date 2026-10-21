import api from './api';

export const authService = {
  login: async (email, password) => {
    return await api.post('/auth/login', { email, password });
  },

  register: async (userData) => {
    return await api.post('/auth/register', userData);
  },

  getMe: async () => {
    return await api.get('/auth/me');
  },

  getProfile: async () => {
    return await api.get('/users/me');
  },

  updateProfile: async (data) => {
    return await api.patch('/users/me', data);
  },

  changePassword: async (data) => {
    return await api.patch('/users/me/password', data);
  },
};
