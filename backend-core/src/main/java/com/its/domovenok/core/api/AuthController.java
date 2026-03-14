package com.its.domovenok.core.api;

import com.its.domovenok.core.service.AuthService;
import java.util.Map;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/init")
    public ResponseEntity<?> init(@RequestBody Map<String, String> body) {
        String initData = body.get("initData");
        if (initData == null || initData.isBlank()) {
            return ResponseEntity.badRequest().body(Map.of("error", "initData is required"));
        }
        return authService.init(initData)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.status(401).body(Map.of("error", "Invalid initData")));
    }
}
