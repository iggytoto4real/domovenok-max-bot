package com.its.domovenok.core.api;

import com.its.domovenok.core.dto.AuthInitRequest;

import com.its.domovenok.core.dto.ErrorResponse;
import com.its.domovenok.core.service.AuthService;
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
    public ResponseEntity<?> init(@RequestBody AuthInitRequest body) {
        String initData = body.getInitData();
        if (initData == null || initData.isBlank()) {
            return ResponseEntity.badRequest().body(new ErrorResponse("initData is required"));
        }
        return authService.init(initData)
                .<ResponseEntity<?>>map(ResponseEntity::ok)
                .orElse(ResponseEntity.status(401).body(new ErrorResponse("Invalid initData")));
    }
}
