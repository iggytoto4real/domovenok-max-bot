# mini-app

Web mini-приложение игры Tamagotchi, которое открывается внутри мессенджера MAX. Не Maven-модуль — отдельный фронтенд (Node/JS), на верхнем уровне репозитория рядом с Java-модулями.

## Зачем нужен

- Интерфейс игры: пользователь видит питомца, кормит, играет и т.д.
- Работает внутри MAX через MAX Bridge (`window.WebApp`), общается с backend-core по HTTPS (REST API).
- Состояние хранится только на бэкенде; localStorage не используется.

## Что где лежит

```
mini-app/
  package.json               # Имя, скрипты (start — локальный сервер)
  public/
    index.html               # Точка входа, подключение max-web-app.js, div#app, main.js
  src/
    main.js                  # Инициализация экрана, вызов WebApp.ready()
```

По плану далее добавляются:

- Компоненты/страницы игры (например экран питомца, кнопки действий).
- Сервис для запросов к backend-core (auth/init, get pet, patch pet).
- Обёртки над MAX Bridge (BackButton, HapticFeedback и т.д.).
- Стили (например с MAX UI).

## Запуск

```bash
cd mini-app
npm start
```

Поднимается локальный сервер для папки `public` (например через `serve`). Для работы с MAX и бэкендом нужен HTTPS и настройка URL в панели бота.
