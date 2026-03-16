package com.its.domovenok.core.service;

import com.its.domovenok.core.dto.PetDto;
import com.its.domovenok.core.persistence.PetEntity;
import com.its.domovenok.core.persistence.PetRepository;
import com.its.domovenok.domain.model.Pet;
import java.time.Instant;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional
public class PetService {

    private final SessionStore sessionStore;
    private final PetRepository petRepository;

    /** Стартовые статы нового питомца (одинаковые для всех типов на первом этапе). */
    private static final int START_HUNGER = 50;
    private static final int START_ENERGY = 70;
    private static final int START_HAPPINESS = 70;

    /** Возвращает id пользователя по токену или null. */
    public Long getUserIdByToken(String token) {
        return sessionStore.getUserId(token);
    }

    public PetDto updatePetName(Long userId, String rawName) {
        List<PetEntity> pets = petRepository.findAllByUserIdOrderByIdAsc(userId);
        if (pets.isEmpty()) {
            throw new IllegalStateException("Pet not found for user id=" + userId);
        }
        PetEntity entity = pets.getFirst();
        String name = rawName != null ? rawName.trim() : "";
        if (name.isEmpty()) {
            name = "Домовёнок";
        }
        entity.setName(name);
        entity.setLastUpdatedAt(Instant.now());
        entity = petRepository.save(entity);
        return toDto(entity);
    }

    public PetDto getPetByToken(String token) {
        Long userId = sessionStore.getUserId(token);
        if (userId == null) {
            return null;
        }
        List<PetEntity> pets = petRepository.findAllByUserIdOrderByIdAsc(userId);
        if (pets.isEmpty()) {
            return null;
        }
        PetEntity entity = pets.getFirst();
        return toDto(entity);
    }

    public PetDto createPet(Long userId, String rawName) {
        List<PetEntity> existing = petRepository.findAllByUserIdOrderByIdAsc(userId);
        if (!existing.isEmpty()) {
            throw new IllegalStateException("Pet already exists for user id=" + userId);
        }
        String name = rawName != null ? rawName.trim() : "";
        if (name.isEmpty()) {
            name = "Домовёнок";
        }
        Instant now = Instant.now();
        PetEntity entity = new PetEntity(
                null,
                userId,
                name,
                START_HUNGER,
                START_ENERGY,
                START_HAPPINESS,
                now);
        entity = petRepository.save(entity);
        return toDto(entity);
    }

    private static PetDto toDto(PetEntity e) {
        return new PetDto(
                e.getId(),
                e.getName(),
                null,
                e.getHunger(),
                e.getEnergy(),
                e.getHappiness());
    }

    private static Pet toDomain(PetEntity e) {
        return new Pet(
                e.getId(),
                e.getUserId(),
                e.getName(),
                e.getHunger(),
                e.getEnergy(),
                e.getHappiness(),
                e.getLastUpdatedAt());
    }
}
