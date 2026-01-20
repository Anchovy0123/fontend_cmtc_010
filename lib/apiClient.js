import { BASE_URL } from './api';

const buildUrl = (path) => {
  const base = BASE_URL.replace(/\/+$/, '');
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
      credentials: 'include',
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

export { apiRequest, getAuthToken, setAuthToken, clearAuthToken };
