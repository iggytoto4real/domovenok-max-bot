# backend-bot

Сервис чат-бота для мессенджера MAX: приём обновлений (webhook или long polling), обработка команд (например `/start`), отправка сообщений через Bot API и при необходимости — напоминания пользователям (например «питомец голоден»).

## Зачем нужен

- Связь с MAX: получение сообщений от пользователей и отправка ответов через `platform-api.max.ru`.
- Обработка команд и сценариев бота; при необходимости запрос данных у backend-core (по REST или через общий домен).

## Что где лежит

```
backend-bot/
  pom.xml                    # Spring Boot, Web, backend-domain
  src/main/java/
    com/its/domovenok/bot/
      DomovenokBotApplication.java   # Точка входа Spring Boot
  src/main/resources/
    application-bot.yml      # Порт 8081, токен бота, URL Bot API и backend-core
```

По плану архитектуры далее добавляются:

- `config/` — настройки токена, URL Bot API, режим webhook/polling, URL backend-core
- `client/` — `MaxBotClient`: sendMessage, getUpdates и другие вызовы Bot API
- `webhook/` — контроллер для приёма webhook от MAX (POST /bot/webhook)
- `polling/` — сервис long polling (getUpdates по расписанию)
- `service/` — `BotUpdateHandler` (обработка команд), `ReminderService` (напоминания по расписанию)

## Запуск

Из корня репозитория:

```bash
mvn -pl backend-bot spring-boot:run
```

В `application-bot.yml` нужно задать реальный токен бота и при необходимости URL backend-core.
