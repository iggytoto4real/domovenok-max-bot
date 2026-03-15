package com.its.domovenok.core.dto;

import com.its.domovenok.domain.model.Pet;
import lombok.Value;

@Value
public class CreatePetResult {

    Pet pet;
    int denyuzhki;
    int sokrovishcha;
}

