# backend-core

REST API для web mini-app и вся бизнес-логика игры Tamagotchi: состояние питомцев, валидация пользователей по `initData` MAX, хранение в БД.

## Зачем нужен

- Обслуживает запросы мини-приложения: авторизация по `initData`, получение/обновление состояния питомца.
- Хранит данные в PostgreSQL (JPA).
- Единственный модуль, который напрямую работает с БД игры.

## Что где лежит

```
backend-core/
  pom.xml                    # Spring Boot, Web, Data JPA, backend-domain, PostgreSQL
  src/main/java/
    com/its/domovenok/core/
      DomovenokCoreApplication.java   # Точка входа Spring Boot
  src/main/resources/
    application.yml          # Порт 8080, datasource, JPA
```

По плану архитектуры далее добавляются:

- `config/` — конфигурация Spring (CORS, security и т.д.)
- `api/` — контроллеры: `AuthController` (POST /api/auth/init), `PetController` (GET/PATCH /api/pet)
- `service/` — `PetService`, `AuthService`, логика деградации состояний
- `persistence/` — JPA-сущности (`PetEntity`), репозитории
- `util/` — валидация `initData`, мапперы entity ↔ доменная модель
- `db/migration/` — миграции Flyway/Liquibase

## Запуск

Из корня репозитория:

```bash
mvn -pl backend-core spring-boot:run
```

Или из папки модуля (после `mvn install` в корне):

```bash
cd backend-core && mvn spring-boot:run
```

Нужна доступная БД PostgreSQL с параметрами из `application.yml` (по умолчанию localhost:5432, БД `domovenok`).
