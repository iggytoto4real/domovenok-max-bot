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

function parseUserFromObject(user: any): { id: number; firstName: string; lastName: string; username?: string; photoUrl?: string } | null {
  if (!user || typeof user.id === 'undefined') return null;
  const first = user.first_name ?? user.firstName ?? '';
  const last = user.last_name ?? user.lastName ?? '';
  const photo = user.photo_url ?? user.photoUrl;
  return {
    id: Number(user.id),
    firstName: String(first),
    lastName: String(last),
    username: user.username != null ? String(user.username) : undefined,
    photoUrl: photo != null && photo !== '' ? String(photo) : undefined,
  };
}

/** Парсит пользователя из строки initData (query: user=...&auth_date=...). */
function parseUserFromInitDataString(initData: string): ReturnType<typeof parseUserFromObject> | null {
  try {
    const params = new URLSearchParams(initData);
    const userStr = params.get('user');
    if (!userStr) return null;
    const user = JSON.parse(decodeURIComponent(userStr)) as any;
    return parseUserFromObject(user);
  } catch {
    return null;
  }
}

/** Данные пользователя из initDataUnsafe или из строки initData (только для режима max-fake, без валидации). */
export function getInitDataUnsafeUser(): {
  id: number;
  firstName: string;
  lastName: string;
  username?: string;
  photoUrl?: string;
} | null {
  if (!isMaxEnvironment()) return null;
  const webApp = (window as any).WebApp;
  const unsafe = webApp?.initDataUnsafe;
  let user = unsafe?.user;
  if (user != null) {
    const parsed = parseUserFromObject(user);
    if (parsed) return parsed;
  }
  const initData = typeof webApp?.initData === 'string' ? webApp.initData : null;
  if (initData) return parseUserFromInitDataString(initData);
  return null;
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

/** Закрывает мини-приложение в MAX (если доступно). В браузере не делает ничего. */
export function closeMiniApp(): void {
  if (typeof window === 'undefined') return;
  const win = window as any;
  const webApp = win.WebApp ?? win.Telegram?.WebApp;
  if (!webApp) return;
  if (typeof webApp.close === 'function') {
    webApp.close();
    return;
  }
  if (typeof webApp.closeApp === 'function') {
    webApp.closeApp();
  }
}

