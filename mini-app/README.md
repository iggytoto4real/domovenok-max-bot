# mini-app

Web mini-приложение игры Домовёнок, которое открывается внутри мессенджера MAX. Не Maven-модуль — отдельный фронтенд (React + TypeScript + Vite), на верхнем уровне репозитория рядом с Java-модулями.

## Зачем нужен

- Интерфейс игры: пользователь видит своих домовят, кормит, играет и т.д.
- Работает внутри MAX через MAX Bridge (`window.WebApp`), общается с backend-core по HTTPS (REST API).
- Данные о питомцах хранятся на бэкенде; фронт подтягивает их по токену.

Отдельно описание типов домовых и UX выбора/покупки в mini-app см. в [docs/domovye-types-and-ux.md](../docs/domovye-types-and-ux.md).

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
    App.tsx                  # Выбор режима (dev / prod), инициализация данных и экранов
    app/
      store.ts               # Конфигурация Redux store
    bridge/
      maxBridge.ts           # Обёртка над MAX WebApp: initData, ready, режимы
    api/
      client.ts              # HTTP-клиент (base URL из VITE_API_URL)
      auth.ts                # POST /api/auth/init
      pets.ts                # GET /api/pets
    services/
      userService.ts         # Сервис авторизации: authInit (prod) и getFakeUser (dev)
      petsService.ts         # Сервис питомцев: getPets (prod) и getFakePets (dev)
    features/
      user/
        userSlice.ts         # Redux-слайс пользователя, использует userService для prod/dev
        types.ts
      pets/
        petsSlice.ts         # Redux-слайс питомцев, использует petsService для prod/dev
        types.ts
    components/
      Header/…               # Шапка: имя, ресурсы, меню пользователя
      PetsList.tsx           # Заголовок «Домовята», карточки питомцев, кнопка покупки
      AddPetButton.tsx       # Карточка-призыв «Купить домовёнка»
```

В шапке отображаются ресурсы игрока (Денюжки, Сокровища) и аватар из MAX (в prod). Кнопка «Выход» показывает подтверждение («Домовята будут скучать без тебя!») и при согласии закрывает мини-приложение через `WebApp.close()`.

## Режимы работы и dev/prod логика

- **dev** — запуск через Vite (`npm run dev`) в обычном браузере:
  - данные пользователя берутся из `userService.getFakeUser()`;
  - питомцы загружаются из `petsService.getFakePets()` (фейковые домовята с типами домовых);
  - покупка нового домового создаёт запись только в локальном Redux-состоянии.
- **prod** — запуск внутри MAX:
  - `authInit` идёт через backend-core (`/api/auth/init`), initData берётся из `window.WebApp`;
  - список питомцев загружается из `GET /api/pets` через `petsService.getPets`;
  - покупка нового домового отправляется на `POST /api/pets` (имя и тип), ответ маппится в `PetItem` и добавляется в список.

Выбор режима (`dev` или `prod`) делается в `App.tsx` по `import.meta.env.DEV`. Redux-slice-ы (`userSlice`, `petsSlice`) не знают о режиме напрямую и работают через сервисный слой.

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
