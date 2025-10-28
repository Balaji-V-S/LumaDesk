package com.lumadesk.auth_service.controller;

import com.lumadesk.auth_service.dto.SignInResponse;
import com.lumadesk.auth_service.dto.SignInRequest;
import com.lumadesk.auth_service.dto.SignUpRequest;
import com.lumadesk.auth_service.service.AuthService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.slf4j.Logger; // Using SLF4J for logging
import org.slf4j.LoggerFactory;

@RestController
@CrossOrigin(origins = "*")
@RequestMapping("/api/auth") // Base path for all auth-related endpoints
public class AuthController {

    private static final Logger log = LoggerFactory.getLogger(AuthController.class);

    @Autowired
    private AuthService authService; // Your service that handles the logic

    @PostMapping("/login")
    public ResponseEntity<?> authenticateUser(@Valid @RequestBody SignInRequest loginRequest) {
        log.info("Attempting login for user: {}", loginRequest.getEmail());
        try {
            // Call the AuthService to handle authentication and JWT generation
            SignInResponse authResponse = authService.loginUser(loginRequest);
            log.info("Login successful for user: {}", loginRequest.getEmail());
            // Return 200 OK with the AuthResponse body
            return ResponseEntity.ok(authResponse);
        } catch (Exception e) {
            // Log the actual exception in a real app for debugging
            log.error("Login failed for user {}: {}", loginRequest.getEmail(), e.getMessage());
            // Return 401 Unauthorized for bad credentials or other auth errors
            return ResponseEntity.status(401).body("Error: Invalid Credentials");
        }
    }

    @PostMapping("/register")
    public ResponseEntity<?> registerUser(@Valid @RequestBody SignUpRequest signUpRequest) {
        log.info("Attempting registration for email: {}", signUpRequest.getEmail());
        try {
            authService.registerUser(signUpRequest);
            log.info("Registration successful for email: {}", signUpRequest.getEmail());
            return ResponseEntity.ok("User registered successfully!");
        } catch (RuntimeException e) { // Catch specific exceptions like "Email already in use"
            log.warn("Registration failed for email {}: {}", signUpRequest.getEmail(), e.getMessage());
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (Exception e) {
            log.error("Unexpected error during registration for email {}: {}", signUpRequest.getEmail(), e.getMessage());
            return ResponseEntity.status(500).body("Error: Could not register user.");
        }
    }
}