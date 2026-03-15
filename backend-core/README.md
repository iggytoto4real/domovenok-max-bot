# backend-core

REST API для web mini-app и бизнес-логика игры Домовёнок: авторизация пользователя по `initData` MAX, работа с питомцами и подготовка к хранению состояния в БД.

## Зачем нужен

- Обслуживает запросы мини-приложения: авторизация по `initData`, получение списка питомцев и дальнейшие операции с ними.
- Отделяет web-слой (контроллеры) от доменной логики (сервисы).
- Является точкой входа для будущей интеграции с PostgreSQL (через JPA).

- **DTO** — иммутабельные объекты запросов/ответов; подход описан в [docs/DTO.md](docs/DTO.md).

## Что где лежит сейчас

```
backend-core/
  docs/
    DTO.md                      # Подход к DTO: иммутабельность, создание в один вызов
  pom.xml                       # Spring Boot, Web, backend-domain, PostgreSQL + H2 (runtime), Lombok
  src/main/java/com/its/domovenok/core/
    dto/                        # Иммутабельные DTO (см. docs/DTO.md)
    DomovenokCoreApplication.java   # Точка входа Spring Boot
    api/
      AuthController.java       # POST /api/auth/init — валидация initData, выдача сессии/токена
      PetController.java        # GET /api/pets — список питомцев по токену
    service/
      AuthService.java          # Логика аутентификации по initData (@RequiredArgsConstructor)
      PetService.java           # Заглушка логики работы с питомцами (@RequiredArgsConstructor)
      SessionStore.java         # Простейшее in-memory хранилище сессий
    config/
      WebConfig.java            # CORS (паттерны: localhost, https://*.github.io по умолчанию)
    util/
      InitDataValidator.java    # Валидация initData из MAX по токену бота

  src/main/resources/
    application.yml             # Порт 8080, datasource PostgreSQL, MAX_BOT_TOKEN, CORS
    application-dev.yml         # Профиль dev: H2 в памяти и упрощённые настройки
```

## API питомцев

| Метод | Путь | Описание |
|-------|------|----------|
| GET | `/api/pets` | Список питомцев пользователя (по токену в `Authorization: Bearer …`). |
| POST | `/api/pets` | Создание питомца (покупка домового по типу, со списанием денюжек). |

**POST /api/pets** — тело запроса (`CreatePetRequest`):

- `name` (string) — имя домовёнка;
- `type` (string) — тип домового: `domovoy`, `dvorovoy`, `bannik`, `ovinnik`, `khlevnik`, `kikimora` (значения согласованы с `DomovoyType` в backend-domain и с mini-app).

Экономика и ответы:

- Цена покупки одного питомца задаётся в `BalanceConstants.PET_PRICE_DENYUZHKI` (по умолчанию 300 денюжек); при успешной покупке сумма списывается с поля `denyuzhki` в `UserAccountEntity`.
- Ответ 201 — объект `PetDto`: `id`, `name`, `type`, `imageUrl` (пока null), `hunger`, `energy`, `happiness`.
- При неизвестном `type` — 400 с `{"error":"unknown_type"}`.
- При недостатке средств — 400 с `{"error":"insufficient_funds"}` (баланс не меняется, операция полностью откатывается транзакцией).

Типы домовых заданы в модуле backend-domain (`DomovoyType`), а баланс пользователя — в `UserAccountEntity`.

## Дальнейшее развитие

- Миграции БД (Flyway/Liquibase) вместо `ddl-auto: update`.
- Расширение логики изменения состояний питомцев (кормление, игры и т.д.).

## Запуск

Из корня репозитория:

```bash
mvn -pl backend-core spring-boot:run
```

Или из папки модуля (после `mvn install` в корне):

```bash
cd backend-core && mvn spring-boot:run
```

По умолчанию используется PostgreSQL с параметрами из `application.yml` (localhost:5432, БД `domovenok`).  
Для локальной разработки без БД можно использовать профиль `dev` с H2:

```bash
mvn -pl backend-core spring-boot:run "-Dspring-boot.run.profiles=dev"
```

Переменные окружения:

- `MAX_BOT_TOKEN` — токен бота MAX; используется для проверки подписи `initData`.
- `CORS_ALLOWED_ORIGINS` — список origin-ов (через запятую), с которых мини-приложение может ходить на API.
