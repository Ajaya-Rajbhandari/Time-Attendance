import api from '../utils/api';

export const login = async (credentials) => {
  const response = await api.post('/auth/login', credentials);
  const { token } = response.data;
  localStorage.setItem('token', token);
  return response.data;
};

export const register = async (userData) => {
  const response = await api.post('/auth/register', userData);
  return response.data;
};

export const logout = () => {
  localStorage.removeItem('token');
};