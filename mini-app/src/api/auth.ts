import { apiFetch } from './client';

export interface AuthInitResponse {
  user: {
    id: number;
    firstName: string | null;
    lastName: string | null;
    username?: string | null;
    photoUrl?: string | null;
    denyuzhki: number;
    sokrovishcha: number;
  };
  token: string;
  firstVisit: boolean;
}

export async function authInit(initData: string): Promise<AuthInitResponse> {
  const res = await apiFetch('/api/auth/init', {
    method: 'POST',
    body: JSON.stringify({ initData }),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error((err as any).error ?? `Auth failed: ${res.status}`);
  }
  return res.json();
}
