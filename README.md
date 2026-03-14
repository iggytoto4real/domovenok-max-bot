# domovenok-max-bot

Домовёнок — бот-игра по мотивам русских сказок. Твой домовёнок живёт в мини-приложении: у него есть голод, энергия и настроение. Корми, ухаживай и играй с ним, чтобы он был доволен. Бот может напоминать тебе зайти и уделить питомцу время. Запускай игру кнопкой в чате и расти своего домовёнка.

## Канал с новостями разработки

[Домовёнок - блог разработчика](https://max.ru/id246009594706_biz) — новости разработки Домовёнка, анонсы обновлений и заметки о том, как развивается бот и мини-приложение.

## Структура репозитория

| Путь | Описание |
|------|----------|
| [backend-domain/](backend-domain/README.md) | Общий доменный модуль (модели, без Spring) |
| [backend-core/](backend-core/README.md) | REST API и бизнес-логика игры, БД |
| [backend-bot/](backend-bot/README.md) | Сервис чат-бота MAX (Bot API, webhook/polling) |
| [mini-app/](mini-app/README.md) | Web mini-приложение (игра в браузере внутри MAX) |
| `pom.xml` | Корневой Maven-проект (multi-module), Java 17, Spring Boot 3.x |

- **Maven-модули** собираются из корня: `mvn clean install`
- **mini-app** — отдельный фронт (React + Vite), не входит в Maven; запуск: `cd mini-app && npm run dev`

Подробнее — в README каждого модуля. Режимы запуска (local, max-fake, prod) и деплой: [docs/LOCAL_MODE.md](docs/LOCAL_MODE.md), [docs/MAX_FAKE_MODE.md](docs/MAX_FAKE_MODE.md), [docs/PROD_LAUNCH.md](docs/PROD_LAUNCH.md).
