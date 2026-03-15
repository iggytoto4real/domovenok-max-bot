package com.its.domovenok.core.service;

import com.its.domovenok.core.config.BalanceConstants;
import com.its.domovenok.core.dto.CreatePetRequestDto;
import com.its.domovenok.core.dto.CreatePetResult;
import com.its.domovenok.core.dto.PetDto;
import com.its.domovenok.core.persistence.PetEntity;
import com.its.domovenok.core.persistence.PetRepository;
import com.its.domovenok.core.persistence.UserAccountEntity;
import com.its.domovenok.core.persistence.UserAccountRepository;
import com.its.domovenok.domain.model.DomovoyType;
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
    private final UserAccountRepository userAccountRepository;

    /** Стартовые статы нового питомца (одинаковые для всех типов на первом этапе). */
    private static final int START_HUNGER = 50;
    private static final int START_ENERGY = 70;
    private static final int START_HAPPINESS = 70;

    /** Возвращает id пользователя по токену или null. */
    public Long getUserIdByToken(String token) {
        return sessionStore.getUserId(token);
    }

    @Transactional(readOnly = true)
    public List<PetDto> getPetsByToken(String token) {
        Long userId = sessionStore.getUserId(token);
        if (userId == null) {
            return null;
        }
        List<PetEntity> entities = petRepository.findAllByUserIdOrderByIdAsc(userId);
        return entities.stream().map(PetService::toDto).collect(Collectors.toList());
    }

    /**
     * Создаёт питомца.
     * <p>
     * Возвращает empty при неизвестном типе (контроллер вернёт 400). При недостатке денюжек бросает
     * {@link InsufficientFundsException}, который контроллер маппит в 400 с ошибкой {@code insufficient_funds}.
     */
    public Optional<CreatePetResult> createPet(Long userId, CreatePetRequestDto request) {
        DomovoyType type = DomovoyType.fromString(request.getType());
        if (type == null) {
            return Optional.empty();
        }

        UserAccountEntity account = userAccountRepository.findById(userId)
                .orElseThrow(() -> new IllegalStateException("User account not found for id=" + userId));
        int price = BalanceConstants.PET_PRICE_DENYUZHKI;
        if (account.getDenyuzhki() < price) {
            throw new InsufficientFundsException("Not enough denyuzhki to buy pet");
        }
        account.setDenyuzhki(account.getDenyuzhki() - price);
        userAccountRepository.save(account);

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
        return Optional.of(new CreatePetResult(pet, account.getDenyuzhki(), account.getSokrovishcha()));
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
