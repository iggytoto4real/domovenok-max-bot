package com.its.domovenok.core.dto;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Value;

@Value
public class CreatePetRequestDto {

    String name;
    String type;

    @JsonCreator
    public static CreatePetRequestDto of(
            @JsonProperty("name") String name,
            @JsonProperty("type") String type) {
        return new CreatePetRequestDto(name, type);
    }
}
