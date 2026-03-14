export function isMaxEnvironment(): boolean {
  return typeof window !== 'undefined' && typeof (window as any).WebApp !== 'undefined';
}

export function getInitData(): string | null {
  if (!isMaxEnvironment()) {
    return null;
  }
  const webApp = (window as any).WebApp;
  return typeof webApp.initData === 'string' ? webApp.initData : null;
}

/** Данные пользователя из initDataUnsafe (только для режима max-fake, без валидации). */
export function getInitDataUnsafeUser(): {
  id: number;
  firstName: string;
  lastName: string;
  username?: string;
  photoUrl?: string;
} | null {
  if (!isMaxEnvironment()) return null;
  const unsafe = (window as any).WebApp?.initDataUnsafe;
  const user = unsafe?.user;
  if (!user || typeof user.id === 'undefined') return null;
  return {
    id: Number(user.id),
    firstName: String(user.first_name ?? ''),
    lastName: String(user.last_name ?? ''),
    username: user.username != null ? String(user.username) : undefined,
    photoUrl: user.photo_url != null ? String(user.photo_url) : undefined,
  };
}

/** Включён ли режим «фейковые данные в MAX»: переменная сборки или ?fake=1 в URL. */
export function isFakeInMaxEnabled(): boolean {
  const env = (import.meta as any).env?.VITE_USE_FAKE_IN_MAX;
  if (env === 'true' || env === true) return true;
  if (typeof window !== 'undefined') {
    const params = new URLSearchParams(window.location.search);
    if (params.get('fake') === '1' || params.get('fake') === 'true') return true;
  }
  return false;
}

export function ready(): void {
  if (!isMaxEnvironment()) {
    return;
  }
  const webApp = (window as any).WebApp;
  if (typeof webApp.ready === 'function') {
    webApp.ready();
  }
}

