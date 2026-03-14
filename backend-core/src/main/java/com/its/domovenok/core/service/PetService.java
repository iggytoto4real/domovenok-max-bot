package com.its.domovenok.core.service;

import java.util.Collections;
import java.util.List;
import java.util.Map;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class PetService {

    private final SessionStore sessionStore;

    public List<Map<String, Object>> getPetsByToken(String token) {
        Long userId = sessionStore.getUserId(token);
        if (userId == null) {
            return null;
        }
        // Пока возвращаем пустой список; позже — из БД по userId
        return Collections.emptyList();
    }
}
