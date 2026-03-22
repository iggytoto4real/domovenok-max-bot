## Локальный режим (local)

Локальная разработка без MAX и без боевого backend-core: всё крутится у тебя на машине, можно быстро править фронт и бэкенд.

### mini-app в local-режиме

В этом режиме мини-приложение работает как обычный SPA в браузере: без MAX, без `initData`, с фейковыми данными.

```bash
cd mini-app
npm install          # если ещё не ставил зависимости
npm run dev
```

Откроется `http://localhost:5173`. Режим `local` определяется в `App.tsx` автоматически: нет MAX WebApp, поэтому берутся фейковые пользователь и один фейковый домовёнок.

### backend-core для локальной проверки

Если хочешь погонять реальный API, можно поднять `backend-core` с in-memory БД (профиль `dev`):

```bash
# Из корня репозитория
set MAX_BOT_TOKEN=твой_токен_бота          # при необходимости проверки initData
set CORS_ALLOWED_ORIGINS=http://localhost:5173

mvn -pl backend-core spring-boot:run "-Dspring-boot.run.profiles=dev"
```

В этом режиме используется H2 в памяти, PostgreSQL не нужен.  
URL API по умолчанию: `http://localhost:8080` — его можно указать в `VITE_API_URL` при сборке фронта или использовать только для ручного тестирования.

### Mini-app на GitHub Pages + бэкенд локально

Если mini-app задеплоен на GitHub Pages (пуши в `main` по пути `mini-app/**` запускают workflow и деплой), приложение по умолчанию собрано с `VITE_API_URL=http://localhost:8080`. Можно открыть URL вида `https://<user>.github.io/domovenok-max-bot/`, поднять backend-core локально на 8080 — запросы пойдут на твой localhost. CORS в backend-core по умолчанию разрешает origin `https://*.github.io`, отдельно настраивать не нужно.

**Важно:** страница на GitHub Pages открывается по **HTTPS**, а API по умолчанию — **HTTP** на `localhost`. Некоторые браузеры блокируют такие запросы как *mixed content* (защищённая страница → незащищённый localhost). Если в консоли видишь блокировку mixed content, открой мини-приложение по **HTTP** с той же машины (например `npm run dev` на `http://localhost:5173` с `VITE_API_URL=http://localhost:8080`) или подними API по HTTPS (туннель ngrok/cloudflared с HTTPS → прокси на `localhost:8080`).

### Бот в чате с локали (long polling)

Чтобы бот **отвечал в чате** (например на `/start`), не обязательно деплоить его: можно запустить `backend-bot` на своём компьютере. Используется long polling — бот сам опрашивает MAX, входящий URL с интернета не нужен.

1. Возьми токен бота в панели MAX (Чат-боты → твой бот → Интеграция).
2. В терминале из корня репозитория:

   ```bash
   set MAX_BOT_TOKEN=твой_токен
   mvn -pl backend-bot spring-boot:run
   ```

3. Напиши боту в MAX команду `/start`. Бот должен ответить:
   - «Привет! Нажми кнопку «Играть», чтобы открыть своих домовят.
   - Канал с новостями разработки: https://max.ru/id246009594706_biz»

