package com.its.domovenok.core.dto;

import java.util.List;
import lombok.Value;

@Value
public class GetPetsResponse {

    List<PetDto> pets;
}
