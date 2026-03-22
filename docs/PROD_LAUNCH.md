# Prod-режим (боевой запуск в MAX)

Этот документ описывает **боевой** запуск Домовёнка в MAX:

- backend-core по HTTPS;
- mini-app задеплоен как статика по HTTPS;
- бот в MAX привязан к мини-приложению.

Режим **local** описан в `docs/LOCAL_MODE.md` (локальная разработка + long polling бота).

---

## 1. Backend (backend-core)

### Переменные окружения

- **MAX_BOT_TOKEN** — токен бота (Платформа MAX для партнёров → Чат-боты → Интеграция → Получить токен). Без него валидация `initData` не пройдёт.
- **CORS_ALLOWED_ORIGINS** — если задана, **полностью заменяет** список из `application.yml`: через запятую origins или паттерны. Если не задана — по умолчанию localhost (в т.ч. `127.0.0.1`, порты 5173/3000/4173) и `https://*.github.io` для GitHub Pages → localhost API. Для своего домена укажи явно, например: `https://твой-домен.vercel.app`.

### Деплой backend

- Размести backend-core на сервере с HTTPS (VPS, облако, PaaS).
- Установи переменные `MAX_BOT_TOKEN` и `CORS_ALLOWED_ORIGINS` (origins = HTTPS URL мини-приложения).
- Пример URL API: `https://api.твой-домен.ru`.

---

## 2. Frontend (mini-app)

### Деплой на GitHub Pages (из коробки)

При пуше в `main` (изменения в `mini-app/**` или в workflow) GitHub Actions собирает mini-app и деплоит на GitHub Pages. Включи в репо: **Settings → Pages → Source = GitHub Actions**.

- Сборка сейчас с `VITE_API_URL=http://localhost:8080` в workflow — это **неудобно для реальной проверки с GitHub Pages**: браузер с **HTTPS** нестабильно ходит на **localhost** (mixed content, Private Network Access). Для локальной разработки лучше **`npm run dev` без `VITE_API_URL`** (прокси в Vite → см. `docs/LOCAL_MODE.md`). Для проверки «как на проде» укажи **публичный HTTPS URL** API (задеплоенный backend или туннель на `:8080`) и пропиши его в `VITE_API_URL` в [.github/workflows/deploy-mini-app.yml](.github/workflows/deploy-mini-app.yml).

### Сборка под прод (свой хостинг)

Укажи URL бэкенда при сборке:

```bash
cd mini-app
export VITE_API_URL=https://api.твой-домен.ru
npm run build
```

В `dist/` будет статика. Её нужно раздавать по **HTTPS**.

### Деплой фронта (альтернатива GitHub Pages)

- Залей содержимое `dist/` на любой статический хостинг с HTTPS (Vercel, Netlify, облачное хранилище + CDN и т.п.).
- Итоговый URL мини-приложения, например: `https://domovenok.vercel.app`.

---

## 3. Настройка бота в MAX

1. Открой [Платформа MAX для партнёров](https://business.max.ru/self) → Чат-боты → выбери своего бота.
2. Раздел **«Чат-бот и мини-приложение»** → **Настроить**.
3. В поле **URL мини-приложения** вставь HTTPS-адрес, по которому открывается собранное приложение (например `https://domovenok.vercel.app`).
4. Выбери тип кнопки (например «Играть») и сохрани.

После этого в чате с ботом появится кнопка; по нажатию откроется твой SPA. В MAX будет доступен `window.WebApp` и `initData`; фронт отправит их на `POST /api/auth/init`, получит пользователя и токен, затем запросит `GET /api/pet` с этим токеном.

---

## 4. Краткий чек-лист prod

| Шаг | Действие |
|-----|----------|
| 1 | Взять токен бота в панели MAX, задать `MAX_BOT_TOKEN` на бэкенде |
| 2 | Задеплоить backend-core по HTTPS, указать `CORS_ALLOWED_ORIGINS` = URL мини-приложения |
| 3 | Собрать mini-app с `VITE_API_URL` = URL бэкенда, задеплоить статику по HTTPS |
| 4 | В настройках бота в MAX указать URL мини-приложения (HTTPS) и сохранить |
| 5 | Открыть бота в MAX и нажать кнопку мини-приложения — должен открыться экран с шапкой и карточкой домовёнка |

Если при открытии из MAX видишь ошибку авторизации — проверь, что токен бота совпадает с ботом, к которому привязано мини-приложение, и что CORS разрешает origin твоего фронта.

---


