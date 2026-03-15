package com.its.domovenok.core.dto;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Value;

@Value
public class AuthInitRequest {

    String initData;

    @JsonCreator
    public static AuthInitRequest of(@JsonProperty("initData") String initData) {
        return new AuthInitRequest(initData);
    }
}
