package com.its.domovenok.core.service;

import com.its.domovenok.core.dto.CreatePetRequestDto;
import com.its.domovenok.core.dto.PetDto;
import com.its.domovenok.core.persistence.PetEntity;
import com.its.domovenok.core.persistence.PetRepository;
import com.its.domovenok.domain.model.DomovoyType;
import com.its.domovenok.domain.model.Pet;
import java.time.Instant;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
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

    public List<PetDto> getPetsByToken(String token) {
        Long userId = sessionStore.getUserId(token);
        if (userId == null) {
            return null;
        }
        List<PetEntity> entities = petRepository.findAllByUserIdOrderByIdAsc(userId);
        return entities.stream().map(PetService::toDto).collect(Collectors.toList());
    }

    /**
     * Создаёт питомца. Возвращает empty при неизвестном типе (контроллер вернёт 400).
     */
    public Optional<Pet> createPet(Long userId, CreatePetRequestDto request) {
        DomovoyType type = DomovoyType.fromString(request.getType());
        if (type == null) {
            return Optional.empty();
        }
        String name = request.getName() != null ? request.getName().trim() : "";
        if (name.isEmpty()) {
            name = "Домовёнок";
        }
        Instant now = Instant.now();
        PetEntity entity = new PetEntity(
                null,
                userId,
                name,
                type,
                START_HUNGER,
                START_ENERGY,
                START_HAPPINESS,
                now);
        entity = petRepository.save(entity);
        Pet pet = toDomain(entity);
        return Optional.of(pet);
    }

    private static PetDto toDto(PetEntity e) {
        return new PetDto(
                e.getId(),
                e.getName(),
                e.getType().name(),
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
                e.getType(),
                e.getHunger(),
                e.getEnergy(),
                e.getHappiness(),
                e.getLastUpdatedAt());
    }
}
