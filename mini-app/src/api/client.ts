/**
 * Base URL для API.
 *
 * - **dev (`npm run dev`), `VITE_API_URL` не задан** — пустая строка: запросы на `/api/...` с того же origin,
 *   Vite проксирует на `http://localhost:8080` (без CORS и без Private Network Access).
 * - **`VITE_API_URL` задан** — прямой URL (нужен CORS на backend-core).
 * - **prod build без переменной** — fallback `http://localhost:8080` (локальный preview).
 */
function resolveApiBase(): string {
  const env = (import.meta as any).env?.VITE_API_URL as string | undefined;
  if (env != null && String(env).trim() !== '') {
    return String(env).replace(/\/$/, '');
  }
  if (import.meta.env.DEV) {
    return '';
  }
  return 'http://localhost:8080';
}

const API_BASE = resolveApiBase();

export function getApiBase(): string {
  return API_BASE;
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
  // Без cookies: только Bearer — проще CORS при прямом VITE_API_URL на :8080.
  return fetch(url, { ...init, headers, credentials: 'omit' });
}
