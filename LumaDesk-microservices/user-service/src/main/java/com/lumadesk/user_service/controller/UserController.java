package com.lumadesk.user_service.controller;

import com.lumadesk.user_service.dto.UpdateAddressRequest;
import com.lumadesk.user_service.entities.UserProfile;
import com.lumadesk.user_service.service.UserServiceImpl;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
public class UserController {

    @Autowired
    private UserServiceImpl userService;


    @PostMapping("/internal/api/users/create-user-profile")
    public ResponseEntity<UserProfile> createUserProfile(@Valid @RequestBody UserProfile userProfile) {
        UserProfile createdProfile = userService.createUserProfile(userProfile);
        return ResponseEntity.ok(createdProfile);
    }

    @PutMapping("/api/users/change-address")
    public ResponseEntity<UserProfile> updateMyAddress(@Valid @RequestBody UpdateAddressRequest updateAddressrequest) {
        UserProfile updatedProfile = userService.updateAddress(updateAddressrequest);
        return ResponseEntity.ok(updatedProfile);
    }
}
