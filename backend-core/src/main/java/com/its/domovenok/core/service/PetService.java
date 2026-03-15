package com.its.domovenok.core.service;

import com.its.domovenok.core.dto.PetDto;
import java.util.Collections;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class PetService {

    private final SessionStore sessionStore;

    public List<PetDto> getPetsByToken(String token) {
        Long userId = sessionStore.getUserId(token);
        if (userId == null) {
            return null;
        }
        // Пока возвращаем пустой список; позже — из БД по userId
        return Collections.emptyList();
    }
}
