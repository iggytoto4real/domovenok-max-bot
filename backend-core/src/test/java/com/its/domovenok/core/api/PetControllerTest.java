package com.its.domovenok.core.api;

import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import com.its.domovenok.core.dto.PetDto;
import com.its.domovenok.core.service.PetService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.test.web.servlet.MockMvc;

@WebMvcTest(PetController.class)
class PetControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private PetService petService;

    private static final String VALID_TOKEN = "valid-token";
    private static final String BEARER = "Bearer " + VALID_TOKEN;

    @Test
    void getPet_returns401_whenNoAuthorization() throws Exception {
        mockMvc.perform(get("/api/pet"))
                .andExpect(status().isUnauthorized())
                .andExpect(jsonPath("$.error").value("Authorization required"));
    }

    @Test
    void getPet_returns401_whenInvalidToken() throws Exception {
        when(petService.getPetByToken(VALID_TOKEN)).thenReturn(null);

        mockMvc.perform(get("/api/pet").header("Authorization", BEARER))
                .andExpect(status().isUnauthorized())
                .andExpect(jsonPath("$.error").value("Invalid or expired token"));
    }

    @Test
    void getPet_returns200_withPet() throws Exception {
        when(petService.getPetByToken(VALID_TOKEN))
                .thenReturn(new PetDto(1L, "Кузя", null, 50, 70, 70));

        mockMvc.perform(get("/api/pet").header("Authorization", BEARER))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(1))
                .andExpect(jsonPath("$.name").value("Кузя"))
                .andExpect(jsonPath("$.hunger").value(50))
                .andExpect(jsonPath("$.energy").value(70))
                .andExpect(jsonPath("$.happiness").value(70));
    }
}
