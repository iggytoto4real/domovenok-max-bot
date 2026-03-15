package com.its.domovenok.core.persistence;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
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
}
