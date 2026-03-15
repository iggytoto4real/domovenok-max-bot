package com.its.domovenok.core.api;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.its.domovenok.core.dto.CreatePetRequestDto;
import com.its.domovenok.core.dto.PetDto;
import com.its.domovenok.core.service.InsufficientFundsException;
import com.its.domovenok.core.service.PetService;
import com.its.domovenok.domain.model.DomovoyType;
import com.its.domovenok.domain.model.Pet;
import java.time.Instant;
import java.util.List;
import java.util.Optional;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

@WebMvcTest(PetController.class)
class PetControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockBean
    private PetService petService;

    private static final String VALID_TOKEN = "valid-token";
    private static final String BEARER = "Bearer " + VALID_TOKEN;

    @Test
    void getPets_returns401_whenNoAuthorization() throws Exception {
        mockMvc.perform(get("/api/pets"))
                .andExpect(status().isUnauthorized())
                .andExpect(jsonPath("$.error").value("Authorization required"));
    }

    @Test
    void getPets_returns401_whenInvalidToken() throws Exception {
        when(petService.getPetsByToken(VALID_TOKEN)).thenReturn(null);

        mockMvc.perform(get("/api/pets").header("Authorization", BEARER))
                .andExpect(status().isUnauthorized())
                .andExpect(jsonPath("$.error").value("Invalid or expired token"));
    }

    @Test
    void getPets_returns200_withPets() throws Exception {
        when(petService.getPetsByToken(VALID_TOKEN))
                .thenReturn(List.of(new PetDto(1L, "Кузя", "domovoy", null, 50, 70, 70)));

        mockMvc.perform(get("/api/pets").header("Authorization", BEARER))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.pets").isArray())
                .andExpect(jsonPath("$.pets[0].id").value(1))
                .andExpect(jsonPath("$.pets[0].name").value("Кузя"))
                .andExpect(jsonPath("$.pets[0].type").value("domovoy"));
    }

    @Test
    void createPet_returns401_whenNoAuthorization() throws Exception {
        String body = objectMapper.writeValueAsString(CreatePetRequestDto.of("Кузя", "domovoy"));
        mockMvc.perform(post("/api/pets")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(body))
                .andExpect(status().isUnauthorized())
                .andExpect(jsonPath("$.error").value("Authorization required"));
    }

    @Test
    void createPet_returns400_whenUnknownType() throws Exception {
        when(petService.getUserIdByToken(VALID_TOKEN)).thenReturn(100L);
        when(petService.createPet(eq(100L), any(CreatePetRequestDto.class))).thenReturn(Optional.empty());

        String body = objectMapper.writeValueAsString(CreatePetRequestDto.of("Кузя", "unknown"));
        mockMvc.perform(post("/api/pets")
                        .header("Authorization", BEARER)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(body))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.error").value("unknown_type"));
    }

    @Test
    void createPet_returns201_withPetDto_whenValidRequest() throws Exception {
        when(petService.getUserIdByToken(VALID_TOKEN)).thenReturn(100L);
        Pet created = new Pet(42L, 100L, "Кузя", DomovoyType.domovoy, 50, 70, 70, Instant.now());
        when(petService.createPet(eq(100L), any(CreatePetRequestDto.class))).thenReturn(Optional.of(created));

        String body = objectMapper.writeValueAsString(CreatePetRequestDto.of("Кузя", "domovoy"));
        mockMvc.perform(post("/api/pets")
                        .header("Authorization", BEARER)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(body))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.id").value(42))
                .andExpect(jsonPath("$.name").value("Кузя"))
                .andExpect(jsonPath("$.type").value("domovoy"))
                .andExpect(jsonPath("$.hunger").value(50))
                .andExpect(jsonPath("$.energy").value(70))
                .andExpect(jsonPath("$.happiness").value(70));
    }

    @Test
    void createPet_returns400_whenInsufficientFunds() throws Exception {
        when(petService.getUserIdByToken(VALID_TOKEN)).thenReturn(100L);
        when(petService.createPet(eq(100L), any(CreatePetRequestDto.class)))
                .thenThrow(new InsufficientFundsException("Not enough"));

        String body = objectMapper.writeValueAsString(CreatePetRequestDto.of("Кузя", "domovoy"));
        mockMvc.perform(post("/api/pets")
                        .header("Authorization", BEARER)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(body))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.error").value("insufficient_funds"));
    }
}
