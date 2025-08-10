const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:8000/api';

export function getToken() {
  return localStorage.getItem('token');
}

export function setToken(token: string) {
  localStorage.setItem('token', token);
}

export function clearToken() {
  localStorage.removeItem('token');
}

async function request(path: string, options: RequestInit = {}) {
    const token = getToken();
  const defaultHeaders: Record<string, string> = {
    'Content-Type': 'application/json',
     ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };

  let extraHeaders: Record<string, string> = {};
  if (options.headers instanceof Headers) {
    extraHeaders = Object.fromEntries(options.headers.entries());
  } else if (Array.isArray(options.headers)) {
    extraHeaders = Object.fromEntries(options.headers);
  } else if (options.headers) {
    extraHeaders = options.headers as Record<string, string>;
  }

  const headers: Record<string, string> = { ...defaultHeaders, ...extraHeaders };

  if (token) headers['Authorization'] = `Bearer ${token}`;

  const res = await fetch(`${API_BASE}${path}`, { ...options, headers });

  if (!res.ok) {
    const error = await res.json().catch(() => ({}));
    throw { status: res.status, ...error };
  }

  return res.json().catch(() => null);
}


export const api = {
  register: (data: any) => request('/register', { method: 'POST', body: JSON.stringify(data) }),
  login: (data: any) => request('/login', { method: 'POST', body: JSON.stringify(data) }),
  logout: () => request('/logout', { method: 'POST' }),
  getTasks: () => request('/task'),
  createTask: (payload: any) => request('/task', { method: 'POST', body: JSON.stringify(payload) }),
  updateTask: (id: number, payload: any) => request(`/task/${id}`, { method: 'PATCH', body: JSON.stringify(payload) }),
  deleteTask: (id: number) => request(`/task/${id}`, { method: 'DELETE' }),
};
