package com.its.domovenok.core.service;

import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import org.springframework.stereotype.Component;

@Component
public class SessionStore {

    private final Map<String, Long> tokenToUserId = new ConcurrentHashMap<>();

    public void put(String token, Long userId) {
        tokenToUserId.put(token, userId);
    }

    public Long getUserId(String token) {
        return tokenToUserId.get(token);
    }

    public void remove(String token) {
        tokenToUserId.remove(token);
    }
}
