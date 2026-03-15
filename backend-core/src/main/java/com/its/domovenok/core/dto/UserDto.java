package com.its.domovenok.core.dto;

import java.util.Map;
import lombok.Value;

/** Иммутабельный DTO пользователя (профиль из MAX + баланс из нашей БД). */
@Value
public class UserDto {

    Long id;
    String firstName;
    String lastName;
    String username;
    String photoUrl;
    int denyuzhki;
    int sokrovishcha;

    /** Создаёт DTO из данных initData (MAX) и баланса. Все данные задаются при создании. */
    public static UserDto of(Map<String, Object> m, int denyuzhki, int sokrovishcha) {
        Long id = m.get("id") instanceof Number ? ((Number) m.get("id")).longValue() : null;
        String firstName = m.get("firstName") != null ? String.valueOf(m.get("firstName")) : null;
        String lastName = m.get("lastName") != null ? String.valueOf(m.get("lastName")) : null;
        String username = m.get("username") != null ? String.valueOf(m.get("username")) : null;
        String photoUrl = m.get("photoUrl") != null ? String.valueOf(m.get("photoUrl")) : null;
        return new UserDto(id, firstName, lastName, username, photoUrl, denyuzhki, sokrovishcha);
    }
}
