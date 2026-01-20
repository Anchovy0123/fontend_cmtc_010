'use client';

import { apiRequest, clearAuthToken, setAuthToken } from './apiClient';

const register = async (payload) => apiRequest('/api/users', {
  method: 'POST',
  body: payload,
  auth: false,
});

const login = async (payload) => {
  const data = await apiRequest('/login', {
    method: 'POST',
    body: payload,
    auth: false,
  });
  if (data?.token) setAuthToken(data.token);
  return data;
};

const logout = async () => {
  try {
    await apiRequest('/logout', { method: 'POST' });
  } finally {
    clearAuthToken();
  }
};

export { register, login, logout };
