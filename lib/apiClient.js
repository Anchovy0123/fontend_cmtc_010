import { BASE_URL } from './api';

const buildUrl = (path) => {
  const isBrowser = typeof window !== 'undefined';
  if (!path) return isBrowser ? '/' : BASE_URL;
  if (path.startsWith('http://') || path.startsWith('https://')) return path;
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  if (isBrowser) return normalizedPath;
  const base = (BASE_URL || '').replace(/\/+$/, '');
  if (!base) return normalizedPath;
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

const normalizeMessage = (value) => {
  if (!value) return null;
  if (typeof value === 'string') return value;
  try {
    return JSON.stringify(value);
  } catch {
    return String(value);
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

const getAuthSession = () => {
  if (typeof window === 'undefined') return false;
  try {
    return !!localStorage.getItem('token') || localStorage.getItem('session') === '1';
  } catch {
    return false;
  }
};

const setAuthToken = (token) => {
  if (typeof window === 'undefined') return;
  localStorage.setItem('token', token);
  localStorage.setItem('session', '1');
};

const setAuthSession = (active) => {
  if (typeof window === 'undefined') return;
  if (active) {
    localStorage.setItem('session', '1');
  } else {
    localStorage.removeItem('session');
  }
};

const clearAuthToken = () => {
  if (typeof window === 'undefined') return;
  localStorage.removeItem('token');
};

const clearAuthSession = () => {
  if (typeof window === 'undefined') return;
  localStorage.removeItem('session');
};

const apiRequest = async (path, options = {}) => {
  const { method = 'GET', body, headers = {}, auth = true, credentials = 'include' } = options;
  const url = buildUrl(path);
  const finalHeaders = { Accept: 'application/json', 'Content-Type': 'application/json', ...headers };

  let finalBody = body;
  if (body !== undefined && body !== null && typeof body !== 'string') {
    finalBody = JSON.stringify(body);
  }

  if (auth) {
    const token = getAuthToken();
    if (token) finalHeaders.Authorization = `Bearer ${token}`;
  }

  let response;
  try {
    response = await fetch(url, {
      method,
      headers: finalHeaders,
      body: finalBody,
      credentials,
    });
  } catch (error) {
    console.error('API request failed:', { url, method, error });
    const requestError = new Error('Network request failed');
    requestError.cause = error;
    requestError.isNetworkError = true;
    throw requestError;
  }

  const data = await readJson(response);
  if (!response.ok) {
    if (response.status === 401) {
      clearAuthToken();
      clearAuthSession();
      if (typeof window !== 'undefined') {
        window.location.href = '/login';
      }
    }
    console.error('API error response:', {
      url,
      method,
      status: response.status,
      statusText: response.statusText,
      data,
    });
    const message = normalizeMessage(data?.message)
      || normalizeMessage(data?.error)
      || response.statusText
      || 'Request failed';
    const error = new Error(message);
    error.isHttpError = true;
    error.status = response.status;
    error.data = data;
    throw error;
  }

  return data;
};

export {
  apiRequest,
  getAuthToken,
  getAuthSession,
  setAuthToken,
  setAuthSession,
  clearAuthToken,
  clearAuthSession,
};
