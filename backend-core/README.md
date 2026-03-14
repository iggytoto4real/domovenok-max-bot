# backend-core

REST API для web mini-app и бизнес-логика игры Домовёнок: авторизация пользователя по `initData` MAX, работа с питомцами и подготовка к хранению состояния в БД.

## Зачем нужен

- Обслуживает запросы мини-приложения: авторизация по `initData`, получение списка питомцев и дальнейшие операции с ними.
- Отделяет web-слой (контроллеры) от доменной логики (сервисы).
- Является точкой входа для будущей интеграции с PostgreSQL (через JPA).

## Что где лежит сейчас

```
backend-core/
  pom.xml                       # Spring Boot, Web, backend-domain, PostgreSQL + H2 (runtime), Lombok
  src/main/java/com/its/domovenok/core/
    DomovenokCoreApplication.java   # Точка входа Spring Boot
    api/
      AuthController.java       # POST /api/auth/init — валидация initData, выдача сессии/токена
      PetController.java        # GET /api/pets — список питомцев по токену
    service/
      AuthService.java          # Логика аутентификации по initData (@RequiredArgsConstructor)
      PetService.java           # Заглушка логики работы с питомцами (@RequiredArgsConstructor)
      SessionStore.java         # Простейшее in-memory хранилище сессий
    config/
      WebConfig.java            # CORS для mini-app (origins из app.cors.allowed-origins)
    util/
      InitDataValidator.java    # Валидация initData из MAX по токену бота

  src/main/resources/
    application.yml             # Порт 8080, datasource PostgreSQL, MAX_BOT_TOKEN, CORS
    application-dev.yml         # Профиль dev: H2 в памяти и упрощённые настройки
```

## Дальнейшее развитие

- `persistence/` — JPA-сущности (`PetEntity`), репозитории и миграции (Flyway/Liquibase).
- Расширение `PetService` для работы с БД и логики изменения состояний питомцев.

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
