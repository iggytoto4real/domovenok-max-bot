package com.its.domovenok.core.api;

import com.its.domovenok.core.service.PetService;
import java.util.List;
import java.util.Map;
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

    @GetMapping("/pets")
    public ResponseEntity<?> getPets(
            @RequestHeader(value = "Authorization", required = false) String authorization) {
        if (authorization == null || !authorization.startsWith("Bearer ")) {
            return ResponseEntity.status(401).body(Map.of("error", "Authorization required"));
        }
        String token = authorization.substring(7).trim();
        List<Map<String, Object>> pets = petService.getPetsByToken(token);
        if (pets == null) {
            return ResponseEntity.status(401).body(Map.of("error", "Invalid or expired token"));
        }
        return ResponseEntity.ok(Map.of("pets", pets));
    }
}
