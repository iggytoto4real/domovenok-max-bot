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
      AuthController.java       # POST /api/auth/init — валидация initData, выдача сессии/токена и флага firstVisit
      PetController.java        # GET/PATCH /api/pet — работа с единственным домовёнком
    service/
      AuthService.java          # Логика аутентификации по initData, создание/чтение UserAccountEntity
      PetService.java           # Логика работы с единственным питомцем пользователя
      SessionStore.java         # Простейшее in-memory хранилище сессий
    config/
      WebConfig.java            # CORS (паттерны: localhost, https://*.github.io по умолчанию)
    util/
      InitDataValidator.java    # Валидация initData из MAX по токену бота

  src/main/resources/
    application.yml             # Порт 8080, datasource PostgreSQL, MAX_BOT_TOKEN, CORS
    application-dev.yml         # Профиль dev: H2 в памяти и упрощённые настройки
```

## API питомца

**Шаг 1. Авторизация**

| Метод | Путь | Описание |
|-------|------|----------|
| POST | `/api/auth/init` | Валидация `initData` из MAX, создание/чтение `UserAccountEntity`, выдача токена сессии и флага `firstVisit`. |

`POST /api/auth/init` **не создаёт питомца** — он отвечает только за пользователя и баланс. Для работы с домовёнком используется отдельный эндпоинт.

**Шаг 2. Питомец**

| Метод | Путь | Описание |
|-------|------|----------|
| GET | `/api/pet` | Единственный домовёнок пользователя (по токену в `Authorization: Bearer …`). |
| PATCH | `/api/pet` | Обновление имени домовёнка. |

**GET /api/pet**:

- Если токен невалиден или просрочен — 401 с `{"error":"Invalid or expired token"}`.
- Если пользователь заходит впервые и питомца ещё нет — на стороне сервиса автоматически создаётся один стартовый домовёнок с дефолтными статами, без списания денюжек, и возвращается как `PetDto`.
- При последующих запросах возвращается уже существующий питомец.

**PATCH /api/pet**:

- Принимает тело `{"name": "Новое имя"}`.
- Обновляет имя единственного домовёнка пользователя (пустая строка приводит к имени по умолчанию «Домовёнок») и возвращает актуальный `PetDto`.

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
