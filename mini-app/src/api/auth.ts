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

interface AuthInitRequestBody {
  initData: string;
  timeZone?: string;
  /**
   * Смещение пользователя от UTC в целых часах.
   * Например, для UTC+3 значение будет 3, для UTC-2 — -2.
   */
  offsetHours?: number;
}

export async function authInit(
  initData: string,
  timeZone?: string,
  offsetHours?: number,
): Promise<AuthInitResponse> {
  const body: AuthInitRequestBody = {
    initData,
  };

  if (timeZone) {
    body.timeZone = timeZone;
  }

  if (typeof offsetHours === 'number' && Number.isFinite(offsetHours)) {
    body.offsetHours = offsetHours;
  }

  const res = await apiFetch('/api/auth/init', {
    method: 'POST',
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error((err as any).error ?? `Auth failed: ${res.status}`);
  }
  return res.json();
}
