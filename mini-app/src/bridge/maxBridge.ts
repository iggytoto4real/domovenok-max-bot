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

