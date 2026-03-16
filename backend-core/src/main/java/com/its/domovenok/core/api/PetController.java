package com.its.domovenok.core.api;

import com.its.domovenok.core.dto.ErrorResponse;
import com.its.domovenok.core.dto.PetDto;
import com.its.domovenok.core.service.PetService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
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

    @GetMapping("/pet")
    public ResponseEntity<?> getPet(
            @RequestHeader(value = "Authorization", required = false) String authorization) {
        if (authorization == null || !authorization.startsWith("Bearer ")) {
            return ResponseEntity.status(401).body(new ErrorResponse("Authorization required"));
        }
        String token = authorization.substring(7).trim();
        PetDto pet = petService.getPetByToken(token);
        if (pet == null) {
            return ResponseEntity.status(401).body(new ErrorResponse("Invalid or expired token"));
        }
        return ResponseEntity.ok(pet);
    }
}
