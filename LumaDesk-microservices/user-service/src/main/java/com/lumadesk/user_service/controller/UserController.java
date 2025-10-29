package com.lumadesk.user_service.controller;

import com.lumadesk.user_service.entities.UserProfile;
import com.lumadesk.user_service.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
public class UserController {

    @Autowired
    private UserService userService;

    /**
     * This is an internal endpoint called only by the auth-service during registration.
     * It should not be exposed through the API Gateway.
     */
    @PostMapping("/internal/api/users/create-user-profile")
    public ResponseEntity<UserProfile> createUserProfile(@RequestBody UserProfile userProfile) {
        UserProfile createdProfile = userService.createUserProfile(userProfile);
        return ResponseEntity.ok(createdProfile);
    }
}
