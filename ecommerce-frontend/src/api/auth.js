import api from './axios';

export const signup = async (userData) => {
  const response = await api.post('/auth/signup', userData);
  return response.data;
};

export const login = async (credentials) => {
  const response = await api.post('/auth/login', credentials);
  return response.data;
};

export const googleAuth = async (googleData) => {
  const response = await api.post('/auth/google', googleData);
  return response.data;
};

