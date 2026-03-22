## Локальный режим (local)

Всё крутится на твоей машине: быстрый цикл правок фронта и бэкенда.

### Как разрабатывать (кратко)

| Вариант | Когда | Что делать |
|--------|--------|------------|
| **1. Vite + прокси на backend-core** | Основной способ: реальный API без CORS/PNA | `npm run dev` в `mini-app`, **не задавай** `VITE_API_URL` (или удали из `.env`). Подними `backend-core` на `:8080`. Запросы идут на `http://localhost:5173/api/...`, Vite проксирует на `:8080`. |
| **2. Local-режим фронта** | Без бэкенда, только UI | `npm run dev` — в `App.tsx` без `window.WebApp` включаются фейковые данные. |
| **3. Прямой URL на `:8080`** | Отладка сети / как раньше | В `.env` задай `VITE_API_URL=http://localhost:8080` — нужен CORS на backend (уже настроен под `localhost:5173`). |
| **4. Прод-статика (GitHub Pages) + API** | Проверка как у пользователя | Собери фронт с **`VITE_API_URL` = публичный HTTPS API** (деплой backend или туннель ngrok/cloudflared на `:8080`). **Не полагайся на `https://…github.io` → `http://localhost:8080`** — Chrome режет (mixed content, Private Network Access). |

### 1. Рекомендуемый поток: `npm run dev` + backend-core

```bash
# Терминал 1 — API (профиль dev: H2, без PostgreSQL)
cd <корень репо>
set MAX_BOT_TOKEN=твой_токен_бота   # если проверяешь initData
mvn -pl backend-core spring-boot:run "-Dspring-boot.run.profiles=dev"

# Терминал 2 — фронт (без VITE_API_URL → работает proxy в vite.config.ts)
cd mini-app
npm install
npm run dev
```

Открой `http://localhost:5173/domovenok-max-bot/` (с учётом `base` в Vite). Запросы к API идут на тот же origin — **CORS к localhost:8080 не нужен** (прокси на сервере разработки).

Если у тебя в `.env` / `.env.local` всё ещё стоит `VITE_API_URL=http://localhost:8080`, убери или закомментируй — иначе браузер ходит на `:8080` напрямую и снова включаются CORS/PNA.

### mini-app в local-режиме (без API)

Без `window.WebApp` приложение берёт фейкового пользователя и домовёнка — удобно верстать экраны.

```bash
cd mini-app
npm run dev
```

### Бот в чате с локали (long polling)

Чтобы бот **отвечал в чате** (например на `/start`), не обязательно деплоить его: можно запустить `backend-bot` на своём компьютере.

1. Возьми токен бота в панели MAX (Чат-боты → твой бот → Интеграция).
2. В терминале из корня репозитория:

   ```bash
   set MAX_BOT_TOKEN=твой_токен
   mvn -pl backend-bot spring-boot:run
   ```

3. Напиши боту в MAX команду `/start`.
