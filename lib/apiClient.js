import { API_BASE } from './api';

const getBaseForRequest = () => {
  const base = API_BASE.replace(/\/+$/, '');
  if (typeof window === 'undefined') return base;
  try {
    const apiOrigin = new URL(base).origin;
    if (apiOrigin !== window.location.origin) {
      return '';
    }
  } catch {
    return base;
  }
  return base;
};

const buildUrl = (path) => {
  const base = getBaseForRequest();
  if (!path) return base;
  if (path.startsWith('http://') || path.startsWith('https://')) return path;
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  if (base.endsWith('/api') && normalizedPath.startsWith('/api/')) {
    return `${base}${normalizedPath.slice(4)}`;
  }
  return `${base}${normalizedPath}`;
};

const readJson = async (response) => {
  try {
    return await response.json();
  } catch {
    return null;
  }
};

const getAuthToken = () => {
  if (typeof window === 'undefined') return null;
  try {
    return localStorage.getItem('token');
  } catch {
    return null;
  }
};

const setAuthToken = (token) => {
  if (typeof window === 'undefined') return;
  localStorage.setItem('token', token);
};

const clearAuthToken = () => {
  if (typeof window === 'undefined') return;
  localStorage.removeItem('token');
};

const apiRequest = async (path, options = {}) => {
  const { method = 'GET', body, headers = {}, auth = true } = options;
  const url = buildUrl(path);
  const finalHeaders = { Accept: 'application/json', ...headers };

  const isFormData = typeof FormData !== 'undefined' && body instanceof FormData;
  let finalBody = body;

  if (body !== undefined && body !== null && !isFormData && typeof body !== 'string') {
    finalBody = JSON.stringify(body);
    finalHeaders['Content-Type'] = 'application/json';
  }

  if (auth) {
    const token = getAuthToken();
    if (token) finalHeaders.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(url, {
    method,
    headers: finalHeaders,
    body: finalBody,
  });

  const data = await readJson(response);
  if (!response.ok) {
    const message = data?.message || data?.error || response.statusText || 'Request failed';
    const error = new Error(message);
    error.status = response.status;
    error.data = data;
    throw error;
  }

  return data;
};

export { apiRequest, getAuthToken, setAuthToken, clearAuthToken };
