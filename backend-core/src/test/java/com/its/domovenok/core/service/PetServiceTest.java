package com.its.domovenok.core.service;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.when;

import com.its.domovenok.core.dto.PetDto;
import com.its.domovenok.core.persistence.PetEntity;
import com.its.domovenok.core.persistence.PetRepository;
import java.time.Instant;
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

    private PetService petService;

    @BeforeEach
    void setUp() {
        petService = new PetService(sessionStore, petRepository);
    }

    @Test
    void getPetByToken_returnsNull_whenTokenInvalid() {
        when(sessionStore.getUserId("bad-token")).thenReturn(null);

        PetDto result = petService.getPetByToken("bad-token");

        assertThat(result).isNull();
    }

    @Test
    void getPetByToken_returnsExistingPet_whenFound() {
        Long userId = 100L;
        when(sessionStore.getUserId("valid-token")).thenReturn(userId);
        PetEntity entity = new PetEntity(1L, userId, "Кузя", 50, 70, 70, Instant.now());
        when(petRepository.findByUserId(userId)).thenReturn(Optional.of(entity));

        PetDto result = petService.getPetByToken("valid-token");

        assertThat(result).isNotNull();
        assertThat(result.getId()).isEqualTo(1L);
        assertThat(result.getName()).isEqualTo("Кузя");
        assertThat(result.getHunger()).isEqualTo(50);
        assertThat(result.getEnergy()).isEqualTo(70);
        assertThat(result.getHappiness()).isEqualTo(70);
    }

    @Test
    void getPetByToken_createsPet_whenNotFound() {
        Long userId = 200L;
        when(sessionStore.getUserId("new-token")).thenReturn(userId);
        when(petRepository.findByUserId(userId)).thenReturn(Optional.empty());
        when(petRepository.save(org.mockito.ArgumentMatchers.any(PetEntity.class)))
                .thenAnswer(inv -> {
                    PetEntity e = inv.getArgument(0);
                    e.setId(10L);
                    return e;
                });

        PetDto result = petService.getPetByToken("new-token");

        assertThat(result).isNotNull();
        assertThat(result.getId()).isEqualTo(10L);
        assertThat(result.getName()).isEqualTo("Домовёнок");
    }

    @Test
    void getUserIdByToken_returnsUserIdFromSessionStore() {
        when(sessionStore.getUserId("t")).thenReturn(999L);
        assertThat(petService.getUserIdByToken("t")).isEqualTo(999L);
        when(sessionStore.getUserId("t")).thenReturn(null);
        assertThat(petService.getUserIdByToken("t")).isNull();
    }
}
