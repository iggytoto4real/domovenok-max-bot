package com.its.domovenok.core.dto;

import lombok.Value;

@Value
public class PetDto {

    Long id;
    String name;
    /** Тип домового (строка, совпадает с DomovoyTypeId в mini-app). */
    String type;
    String imageUrl;
    Integer hunger;
    Integer energy;
    Integer happiness;
}
