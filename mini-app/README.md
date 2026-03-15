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
  .env.example               # VITE_API_URL

  src/
    main.tsx                 # Вход приложения, Provider, Browser init
    App.tsx                  # Выбор режима (local / prod) и инициализация
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
      Header.tsx             # Шапка: имя, ресурсы (Денюжки/Сокровища), аватар из MAX, меню (Настройки, Выход с подтверждением и закрытием мини-приложения)
      PetsList.tsx           # Заголовок «Домовята», карточки питомцев (фото, имя, сытость/веселье/энергия), кнопка добавления
      AddPetButton.tsx       # Карточка-призыв «Создать домовёнка» (стиль элемента списка, ? вместо фото)
```

В шапке отображаются ресурсы игрока (Денюжки, Сокровища) и аватар из MAX (в prod). Кнопка «Выход» показывает подтверждение («Домовята будут скучать без тебя!») и при согласии закрывает мини-приложение через `WebApp.close()`.

## Режимы работы

- **local** — запуск в браузере без MAX и без backend-core, используются фейковые данные.
- **prod** — запуск внутри MAX, реальный `initData` → backend-core (`/api/auth/init`, `/api/pets`).

Режим определяется автоматически: при наличии `window.WebApp` (MAX) используется prod, иначе — local.

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

Сборка (по умолчанию API — localhost:8080):

```bash
npm run build
```

При пуше в `main` (путь `mini-app/**`) workflow деплоит собранное приложение на **GitHub Pages** (Settings → Pages → Source = GitHub Actions). URL: `https://<user>.github.io/domovenok-max-bot/`. Бэкенд пока можно поднимать локально — CORS по умолчанию разрешает origin с GitHub Pages.

Для боевого бэкенда задай URL при сборке и при необходимости обнови workflow:

```bash
export VITE_API_URL=https://api.твой-домен.ru
npm run build
```

В продакшене укажи итоговый URL мини-приложения в настройках бота MAX.
