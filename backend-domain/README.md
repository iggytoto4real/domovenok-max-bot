# backend-domain

Общий доменный модуль: модели и типы, которые используются и в **backend-core**, и в **backend-bot**. Не содержит Spring, веб-слоя и работы с БД — только «чистый» домен.

## Зачем нужен

- Единая доменная модель без дублирования.
- Изменения в модели делаются в одном месте; core и bot подтягивают их через Maven-зависимость.

## Что где лежит

```
backend-domain/
  pom.xml                    # Maven: jar, Lombok, jakarta.validation
  src/main/java/
    com/its/domovenok/domain/
      model/                 # Доменные сущности (Lombok @Data)
        Pet.java             # Питомец: userId, name, hunger, energy, happiness, lastUpdatedAt
        PetState.java        # Enum состояний (HAPPY, HUNGRY, SAD, SLEEPY)
        UserProfile.java     # Профиль пользователя MAX (id, firstName, lastName, username, photoUrl и т.д.)
```

Модуль не запускается сам по себе — это библиотека. Собирается при `mvn install` из корня или из папки: `mvn clean install`.
