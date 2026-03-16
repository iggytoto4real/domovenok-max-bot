package com.its.domovenok.core.dto;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Value;

@Value
public class UpdatePetNameRequestDto {

    String name;

    @JsonCreator
    public static UpdatePetNameRequestDto of(@JsonProperty("name") String name) {
        return new UpdatePetNameRequestDto(name);
    }
}

