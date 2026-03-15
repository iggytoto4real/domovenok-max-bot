package com.its.domovenok.core.api;

import com.its.domovenok.core.dto.CreatePetRequestDto;
import com.its.domovenok.core.dto.CreatePetResponse;
import com.its.domovenok.core.dto.CreatePetResult;
import com.its.domovenok.core.dto.ErrorResponse;
import com.its.domovenok.core.dto.GetPetsResponse;
import com.its.domovenok.core.dto.PetDto;
import com.its.domovenok.core.service.InsufficientFundsException;
import com.its.domovenok.core.service.PetService;
import com.its.domovenok.domain.model.Pet;
import java.util.List;
import java.util.Optional;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api")
public class PetController {

    private final PetService petService;

    public PetController(PetService petService) {
        this.petService = petService;
    }

    @GetMapping("/pets")
    public ResponseEntity<?> getPets(
            @RequestHeader(value = "Authorization", required = false) String authorization) {
        if (authorization == null || !authorization.startsWith("Bearer ")) {
            return ResponseEntity.status(401).body(new ErrorResponse("Authorization required"));
        }
        String token = authorization.substring(7).trim();
        List<PetDto> pets = petService.getPetsByToken(token);
        if (pets == null) {
            return ResponseEntity.status(401).body(new ErrorResponse("Invalid or expired token"));
        }
        return ResponseEntity.ok(new GetPetsResponse(pets));
    }

    @PostMapping("/pets")
    public ResponseEntity<?> createPet(
            @RequestHeader(value = "Authorization", required = false) String authorization,
            @RequestBody CreatePetRequestDto request) {
        if (authorization == null || !authorization.startsWith("Bearer ")) {
            return ResponseEntity.status(401).body(new ErrorResponse("Authorization required"));
        }
        String token = authorization.substring(7).trim();
        Long userId = petService.getUserIdByToken(token);
        if (userId == null) {
            return ResponseEntity.status(401).body(new ErrorResponse("Invalid or expired token"));
        }
        try {
            Optional<CreatePetResult> created = petService.createPet(userId, request);
            if (created.isEmpty()) {
                return ResponseEntity.badRequest().body(new ErrorResponse("unknown_type"));
            }
            CreatePetResult result = created.get();
            Pet pet = result.getPet();
            PetDto dto = new PetDto(
                    pet.getId(),
                    pet.getName(),
                    pet.getType().name(),
                    null,
                    pet.getHunger(),
                    pet.getEnergy(),
                    pet.getHappiness());
            return ResponseEntity.status(201)
                    .body(new CreatePetResponse(dto, result.getDenyuzhki(), result.getSokrovishcha()));
        } catch (InsufficientFundsException e) {
            return ResponseEntity.badRequest().body(new ErrorResponse("insufficient_funds"));
        }
    }
}
