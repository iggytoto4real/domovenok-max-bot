# backend-bot

Сервис чат-бота для мессенджера MAX: приём обновлений (webhook или long polling), обработка команд (например `/start`), отправка сообщений через Bot API и при необходимости — напоминания пользователям (например «питомец голоден»).

## Зачем нужен

- Связь с MAX: получение сообщений от пользователей и отправка ответов через `platform-api.max.ru`.
- Обработка команд и сценариев бота; при необходимости запрос данных у backend-core (по REST или через общий домен).

## Что где лежит

```
backend-bot/
  pom.xml
  src/main/java/com/its/domovenok/bot/
    DomovenokBotApplication.java
    config/BotProperties.java       # Токен и URL Bot API (Lombok @Getter/@Setter)
    client/MaxBotClient.java        # getUpdates, sendMessage (Authorization без Bearer)
    dto/                            # DTO для ответов Bot API (Lombok)
    service/BotUpdateHandler.java   # Обработка /start, приветствие + ссылка на канал
    service/BotPollingService.java # Long polling в фоне
  src/main/resources/application.yml
```

## Запуск с локали (long polling)

Бот может работать с твоей машины без деплоя: long polling сам опрашивает MAX, входящий URL не нужен.

Из корня репозитория:

```bash
set MAX_BOT_TOKEN=твой_токен_из_панели_MAX
mvn -pl backend-bot spring-boot:run
```

Токен: Платформа MAX для партнёров → Чат-боты → твой бот → Интеграция → Получить токен.

После запуска при отправке боту команды `/start` в чате он ответит:

- «Привет! Нажми кнопку «Играть», чтобы открыть своего домовёнка.
- Канал с новостями разработки: https://max.ru/id246009594706_biz»
