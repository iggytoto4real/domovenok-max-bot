const appRoot = document.getElementById('app');

function render() {
  if (!appRoot) {
    return;
  }

  appRoot.innerHTML = `
    <main style="font-family: system-ui, sans-serif; padding: 16px;">
      <h1>Domovenok MAX Mini App</h1>
      <p>Мини-приложение игры Tamagotchi внутри мессенджера MAX.</p>
    </main>
  `;

  if (window.WebApp && typeof window.WebApp.ready === 'function') {
    window.WebApp.ready();
  }
}

render();

