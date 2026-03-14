# mini-app

Web mini-приложение игры Домовёнок, которое открывается внутри мессенджера MAX. Не Maven-модуль — отдельный фронтенд (React + TypeScript + Vite), на верхнем уровне репозитория рядом с Java-модулями.

## Зачем нужен

- Интерфейс игры: пользователь видит своих домовят, кормит, играет и т.д.
- Работает внутри MAX через MAX Bridge (`window.WebApp`), общается с backend-core по HTTPS (REST API).
- Данные о питомцах хранятся на бэкенде; фронт подтягивает их по токену.

## Стек и структура

Основные технологии:

- React 18
- TypeScript
- Redux Toolkit + React Redux
- Vite

Структура:

```
mini-app/
  package.json               # Скрипты dev/build/preview, зависимости React/Redux/Vite
  index.html                 # Точка входа Vite, подключение max-web-app.js, div#root
  .env.example               # VITE_API_URL, VITE_USE_FAKE_IN_MAX

  src/
    main.tsx                 # Вход приложения, Provider, Browser init
    App.tsx                  # Выбор режима (local / prod / max-fake) и инициализация
    app/
      store.ts               # Конфигурация Redux store
    bridge/
      maxBridge.ts           # Обёртка над MAX WebApp: initData, ready, режимы
    api/
      client.ts              # HTTP-клиент (base URL из VITE_API_URL)
      auth.ts                # POST /api/auth/init
      pets.ts                # GET /api/pets
    features/
      user/
        userSlice.ts         # Авторизация, init с фейковыми/реальными данными
        types.ts
      pets/
        petsSlice.ts         # Список питомцев, загрузка из API или фейковых данных
        types.ts
    components/
      Header.tsx             # Шапка с именем пользователя и меню
      PetsList.tsx           # Список домовят
      AddPetButton.tsx       # Кнопка «Добавить домовёнка»
```

## Режимы работы

- **local** — запуск в браузере без MAX и без backend-core, используются фейковые данные.
- **prod** — запуск внутри MAX, реальный `initData` → backend-core (`/api/auth/init`, `/api/pets`).
- **max-fake** — запуск внутри MAX, но без backend-core: имя пользователя берётся из `initDataUnsafe`, питомцы фейковые.

Переключение режимов:

- `VITE_USE_FAKE_IN_MAX=true` при сборке или
- параметр `?fake=1` в URL мини-приложения (подробнее в `docs/PROD_LAUNCH.md`).

## Запуск

Установка зависимостей:

```bash
cd mini-app
npm install
```

Локальная разработка:

```bash
npm run dev
```

Сборка под прод:

```bash
export VITE_API_URL=https://api.твой-домен.ru   # URL backend-core
npm run build
```

В продакшене нужно раздавать статику из `dist/` по HTTPS и указать этот URL в настройках мини-приложения бота MAX.
