package com.lumadesk.auth_service.controller;

import com.lumadesk.auth_service.dto.*;
import com.lumadesk.auth_service.service.AuthServiceImpl;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@RestController
@CrossOrigin(origins = "*")
@RequestMapping("/api/auth")
public class AuthController {

    private static final Logger log = LoggerFactory.getLogger(AuthController.class);

    @Autowired
    private AuthServiceImpl authService;

    @PostMapping("/login")
    public ResponseEntity<?> authenticateUser(@Valid @RequestBody SignInRequest loginRequest) {
        log.info("Attempting login for user: {}", loginRequest.getEmail());
        try {
            SignInResponse authResponse = authService.loginUser(loginRequest);
            log.info("Login successful for user: {}", loginRequest.getEmail());
            return ResponseEntity.ok(authResponse);
        } catch (Exception e) {
            log.error("Login failed for user {}: {}", loginRequest.getEmail(), e.getMessage());
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
        } catch (RuntimeException e) {
            log.warn("Registration failed for email {}: {}", signUpRequest.getEmail(), e.getMessage());
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (Exception e) {
            log.error("Unexpected error during registration for email {}: {}", signUpRequest.getEmail(), e.getMessage());
            return ResponseEntity.status(500).body("Error: Could not register user.");
        }
    }

    @PostMapping("/reset-password")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<?> changePassword(@Valid @RequestBody ChangePasswordRequest changePasswordRequest) {
        log.info("Attempting to change password for user: {}", changePasswordRequest.getEmail());
        try {
            authService.changePassword(changePasswordRequest);
            log.info("Password changed successfully for user: {}", changePasswordRequest.getEmail());
            return ResponseEntity.ok("Password changed successfully!");
        } catch (Exception e) {
            log.error("Password change failed for user {}: {}", changePasswordRequest.getEmail(), e.getMessage());
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PutMapping("/change-role")
    @PreAuthorize("hasRole('MANAGER')")
    public ResponseEntity<?> updateUserRole(@Valid @RequestBody UpdateRoleRequest updateRoleRequest) {
        try {
            authService.updateUserRole(updateRoleRequest);
            log.info("Role updated successfully for user ID: {}", updateRoleRequest.getUserId());
            return ResponseEntity.ok("User role updated successfully!");
        } catch (RuntimeException e) {
            log.error("Role update failed for user ID {}: {}", updateRoleRequest.getUserId(), e.getMessage());
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}
