package com.its.domovenok.domain.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UserProfile {

    private Long id;
    private String firstName;
    private String lastName;
    private String username;
    private String languageCode;
    private String photoUrl;
    /**
     * Строковый идентификатор часового пояса пользователя, например {@code Europe/Moscow}.
     * Может быть {@code null}, если часовой пояс ещё не определён.
     */
    private String timeZone;
    /**
     * Смещение пользователя от UTC в целых часах.
     * Например, для UTC+3 значение будет 3, для UTC-2 — -2.
     * Может быть {@code null}, если смещение ещё не определено.
     */
    private Integer offsetHours;
}
