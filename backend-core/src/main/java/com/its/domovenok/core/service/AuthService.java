package com.its.domovenok.core.service;

import com.its.domovenok.core.util.InitDataValidator;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final InitDataValidator initDataValidator;
    private final SessionStore sessionStore;

    @Value("${max.bot.token:}")
    private String botToken;

    public Optional<Map<String, Object>> init(String initData) {
        Optional<Map<String, Object>> userOpt = initDataValidator.parseAndValidate(initData, botToken);
        if (userOpt.isEmpty()) {
            return Optional.empty();
        }
        Map<String, Object> user = userOpt.get();
        Object idObj = user.get("id");
        Long userId = idObj instanceof Number ? ((Number) idObj).longValue() : null;
        if (userId == null) {
            return Optional.empty();
        }
        String token = UUID.randomUUID().toString();
        sessionStore.put(token, userId);
        return Optional.of(Map.<String, Object>of(
                "user", user,
                "token", token
        ));
    }
}
