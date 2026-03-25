package com.robintech.backend.controller;

import com.robintech.backend.dto.AuthResponse;
import com.robintech.backend.dto.LoginRequest;
import com.robintech.backend.dto.RegisterRequest;
import com.robintech.backend.service.AuthService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    @PostMapping("/register")
    public ResponseEntity<AuthResponse> register(@Valid @RequestBody RegisterRequest request) {
        return ResponseEntity.ok(authService.register(request));
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@Valid @RequestBody LoginRequest request) {
        return ResponseEntity.ok(authService.login(request));
    }
}
//```
//
//        ---
//
//        ## Test it!
//
//Run the backend from IntelliJ (click the green play button), then test with these requests in Postman or any HTTP client:
//
//        **Register:**
//        ```
//POST http://localhost:8080/api/auth/register
//Content-Type: application/json
//
//{
//    "username": "john_dev",
//        "email": "john@example.com",
//        "password": "password123"
//}
//```
//
//        **Login:**
//        ```
//POST http://localhost:8080/api/auth/login
//Content-Type: application/json
//
//{
//    "email": "john@example.com",
//        "password": "password123"
//}