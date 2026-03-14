package com.its.domovenok.domain.model;

import java.time.Instant;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class Pet {

    private Long userId;
    private String name;
    private int hunger;      // 0-100
    private int energy;      // 0-100
    private int happiness;   // 0-100
    private Instant lastUpdatedAt;
}
