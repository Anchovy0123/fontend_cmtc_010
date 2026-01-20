'use client';

import {
  apiRequest,
  clearAuthSession,
  clearAuthToken,
  setAuthSession,
  setAuthToken,
} from './apiClient';

const register = async (payload) => apiRequest('/users', {
  method: 'POST',
  body: payload,
  auth: false,
});

const login = async (payload) => {
  const username = String(payload?.username ?? '').trim();
  const password = payload?.password;
  const data = await apiRequest('/api/login', {
    method: 'POST',
    body: {
      username,
      email: username,
      password,
    },
    auth: false,
  });
  if (data?.token) setAuthToken(data.token);
  if (data?.token || data?.ok) setAuthSession(true);
  return data;
};

const logout = async () => {
  try {
    await apiRequest('/api/logout', { method: 'POST' });
  } finally {
    clearAuthToken();
    clearAuthSession();
  }
};

export { register, login, logout };
