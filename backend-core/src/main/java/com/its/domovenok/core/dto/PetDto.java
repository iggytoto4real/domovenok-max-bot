package com.its.domovenok.core.dto;

import lombok.Value;

@Value
public class PetDto {

    Long id;
    String name;
    String imageUrl;
    Integer hunger;
    Integer energy;
    Integer happiness;
}
