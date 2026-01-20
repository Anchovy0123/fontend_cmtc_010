'use client';

import { apiRequest, clearAuthToken, setAuthToken } from './apiClient';

const register = async (payload) => apiRequest('/api/auth/register', {
  method: 'POST',
  body: payload,
  auth: false,
});

const login = async (payload) => {
  const data = await apiRequest('/api/auth/login', {
    method: 'POST',
    body: payload,
    auth: false,
  });
  if (data?.token) setAuthToken(data.token);
  return data;
};

const logout = async () => {
  try {
    await apiRequest('/api/auth/logout', { method: 'POST' });
  } finally {
    clearAuthToken();
  }
};

export { register, login, logout };
