package com.its.domovenok.core.persistence;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import java.time.LocalDate;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "user_account")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class UserAccountEntity {

    /** ID пользователя из MAX (приходит в initData, не генерируем). */
    @Id
    private Long id;

    @Column(nullable = false)
    private int denyuzhki = 0;

    @Column(nullable = false)
    private int sokrovishcha = 0;

    /**
     * Строковый идентификатор часового пояса пользователя, например {@code Europe/Moscow}.
     * Может быть {@code null}, если часовой пояс ещё не определён.
     */
    @Column(name = "time_zone")
    private String timeZone;

    /**
     * Смещение пользователя от UTC в целых часах.
     * Например, для UTC+3 значение будет 3, для UTC-2 — -2.
     * Может быть {@code null}, если смещение ещё не определено.
     */
    @Column(name = "offset_hours")
    private Integer offsetHours;

    /**
     * Локальная календарная дата пользователя, за которую уже начислен ежедневный доход (в его часовом поясе).
     */
    @Column(name = "last_daily_income_local_date")
    private LocalDate lastDailyIncomeLocalDate;

    public UserAccountEntity(Long id, int denyuzhki, int sokrovishcha) {
        this.id = id;
        this.denyuzhki = denyuzhki;
        this.sokrovishcha = sokrovishcha;
    }
}
