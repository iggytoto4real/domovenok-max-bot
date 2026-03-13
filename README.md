# domovenok-max-bot

Tamagotchi-like бот для мессенджера MAX в виде web mini-app игры с Java-бэкендом.

## Структура репозитория

| Путь | Описание |
|------|----------|
| [backend-domain/](backend-domain/README.md) | Общий доменный модуль (модели, без Spring) |
| [backend-core/](backend-core/README.md) | REST API и бизнес-логика игры, БД |
| [backend-bot/](backend-bot/README.md) | Сервис чат-бота MAX (Bot API, webhook/polling) |
| [mini-app/](mini-app/README.md) | Web mini-приложение (игра в браузере внутри MAX) |
| `pom.xml` | Корневой Maven-проект (multi-module), Java 17, Spring Boot 3.x |

- **Maven-модули** собираются из корня: `mvn clean install`
- **mini-app** — отдельный Node-проект, не входит в Maven; запуск: `cd mini-app && npm start`

Подробнее — в README каждого модуля.
