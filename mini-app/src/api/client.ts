const API_BASE = (import.meta as any).env?.VITE_API_URL ?? 'http://localhost:8080';

export function getApiBase(): string {
  return API_BASE.replace(/\/$/, '');
}

export async function apiFetch(path: string, options: RequestInit & { token?: string } = {}): Promise<Response> {
  const { token, ...init } = options;
  const url = `${getApiBase()}${path.startsWith('/') ? path : `/${path}`}`;
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...(init.headers as Record<string, string>),
  };
  if (token) {
    (headers as Record<string, string>)['Authorization'] = `Bearer ${token}`;
  }
  return fetch(url, { ...init, headers, credentials: 'include' });
}
