package com.its.domovenok.core.service;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;

import com.its.domovenok.core.config.BalanceConstants;
import com.its.domovenok.core.dto.CreatePetRequestDto;
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
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

@ExtendWith(MockitoExtension.class)
class PetServiceTest {

    @Mock
    private SessionStore sessionStore;

    @Mock
    private PetRepository petRepository;

    @Mock
    private UserAccountRepository userAccountRepository;

    private PetService petService;

    @BeforeEach
    void setUp() {
        petService = new PetService(sessionStore, petRepository, userAccountRepository);
    }

    @Test
    void getPetsByToken_returnsNull_whenTokenInvalid() {
        when(sessionStore.getUserId("bad-token")).thenReturn(null);

        List<PetDto> result = petService.getPetsByToken("bad-token");

        assertThat(result).isNull();
    }

    @Test
    void getPetsByToken_returnsPetsFromRepository() {
        Long userId = 100L;
        when(sessionStore.getUserId("valid-token")).thenReturn(userId);
        PetEntity entity = entity(1L, userId, "Кузя", DomovoyType.domovoy);
        when(petRepository.findAllByUserIdOrderByIdAsc(userId)).thenReturn(List.of(entity));

        List<PetDto> result = petService.getPetsByToken("valid-token");

        assertThat(result).hasSize(1);
        assertThat(result.get(0).getId()).isEqualTo(1L);
        assertThat(result.get(0).getName()).isEqualTo("Кузя");
        assertThat(result.get(0).getType()).isEqualTo("domovoy");
        assertThat(result.get(0).getHunger()).isEqualTo(50);
        assertThat(result.get(0).getEnergy()).isEqualTo(70);
        assertThat(result.get(0).getHappiness()).isEqualTo(70);
    }

    @Test
    void createPet_returnsEmpty_whenTypeUnknown() {
        CreatePetRequestDto request = CreatePetRequestDto.of("Кузя", "unknown_type");
        when(userAccountRepository.findById(100L)).thenReturn(Optional.of(new UserAccountEntity(100L, 1000, 1)));
        Optional<Pet> result = petService.createPet(100L, request);

        assertThat(result).isEmpty();
    }

    @Test
    void createPet_createsPetWithCorrectNameAndType() {
        CreatePetRequestDto request = CreatePetRequestDto.of("Домовёнок Фома", "dvorovoy");
        when(userAccountRepository.findById(100L)).thenReturn(
                Optional.of(new UserAccountEntity(100L, BalanceConstants.PET_PRICE_DENYUZHKI + 100, 0)));
        when(petRepository.save(any(PetEntity.class))).thenAnswer(inv -> {
            PetEntity e = inv.getArgument(0);
            e.setId(42L);
            return e;
        });

        Optional<Pet> result = petService.createPet(100L, request);

        assertThat(result).isPresent();
        Pet pet = result.get();
        assertThat(pet.getId()).isEqualTo(42L);
        assertThat(pet.getUserId()).isEqualTo(100L);
        assertThat(pet.getName()).isEqualTo("Домовёнок Фома");
        assertThat(pet.getType()).isEqualTo(DomovoyType.dvorovoy);
        assertThat(pet.getHunger()).isEqualTo(50);
        assertThat(pet.getEnergy()).isEqualTo(70);
        assertThat(pet.getHappiness()).isEqualTo(70);
    }

    @Test
    void createPet_usesDefaultName_whenNameEmpty() {
        CreatePetRequestDto request = CreatePetRequestDto.of("  ", "bannik");
        when(userAccountRepository.findById(200L)).thenReturn(
                Optional.of(new UserAccountEntity(200L, BalanceConstants.PET_PRICE_DENYUZHKI + 50, 0)));
        when(petRepository.save(any(PetEntity.class))).thenAnswer(inv -> {
            PetEntity e = inv.getArgument(0);
            e.setId(1L);
            return e;
        });

        Optional<Pet> result = petService.createPet(200L, request);

        assertThat(result).isPresent();
        assertThat(result.get().getName()).isEqualTo("Домовёнок");
        assertThat(result.get().getType()).isEqualTo(DomovoyType.bannik);
    }

    @Test
    void getUserIdByToken_returnsUserIdFromSessionStore() {
        when(sessionStore.getUserId("t")).thenReturn(999L);
        assertThat(petService.getUserIdByToken("t")).isEqualTo(999L);
        when(sessionStore.getUserId("t")).thenReturn(null);
        assertThat(petService.getUserIdByToken("t")).isNull();
    }

    private static PetEntity entity(Long id, Long userId, String name, DomovoyType type) {
        PetEntity e = new PetEntity();
        e.setId(id);
        e.setUserId(userId);
        e.setName(name);
        e.setType(type);
        e.setHunger(50);
        e.setEnergy(70);
        e.setHappiness(70);
        e.setLastUpdatedAt(Instant.now());
        return e;
    }
}
