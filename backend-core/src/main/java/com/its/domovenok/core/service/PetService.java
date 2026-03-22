package com.its.domovenok.core.service;

import com.its.domovenok.core.dto.PetDto;
import com.its.domovenok.core.persistence.PetEntity;
import com.its.domovenok.core.persistence.PetRepository;
import com.its.domovenok.core.persistence.UserAccountEntity;
import com.its.domovenok.core.persistence.UserAccountRepository;
import com.its.domovenok.domain.model.Pet;
import com.its.domovenok.domain.model.TimeOfDay;
import com.its.domovenok.domain.model.TimeOfDayCalculator;
import com.its.domovenok.domain.model.UserProfile;
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
    private final UserAccountRepository userAccountRepository;

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
        PetEntity entity = pets.get(0);
        String name = rawName != null ? rawName.trim() : "";
        if (name.isEmpty()) {
            name = "Домовёнок";
        }
        entity.setName(name);
        entity.setLastUpdatedAt(Instant.now());
        entity = petRepository.save(entity);
        return toDtoWithTimeOfDay(userId, entity);
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
        return toDtoWithTimeOfDay(userId, pets.get(0));
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
        return toDtoWithTimeOfDay(userId, entity);
    }

    private PetDto toDtoWithTimeOfDay(Long userId, PetEntity e) {
        TimeOfDay timeOfDay = calculateTimeOfDay(userId);
        String timeOfDayValue = timeOfDay != null ? timeOfDay.name() : null;

        return new PetDto(
                e.getId(),
                e.getName(),
                null,
                e.getHunger(),
                e.getEnergy(),
                e.getHappiness(),
                timeOfDayValue);
    }

    private TimeOfDay calculateTimeOfDay(Long userId) {
        if (userId == null) {
            return TimeOfDay.DAY;
        }
        UserAccountEntity account = userAccountRepository.findById(userId).orElse(null);
        if (account == null) {
            return TimeOfDay.DAY;
        }
        UserProfile profile = new UserProfile(
                account.getId(),
                null,
                null,
                null,
                null,
                null,
                account.getTimeZone(),
                account.getOffsetHours());
        return TimeOfDayCalculator.calculate(Instant.now(), profile);
    }
}
