package com.its.domovenok.core.dto;

import lombok.Value;

@Value
public class AuthInitResponse {

    UserDto user;
    String token;
    boolean firstVisit;
}
