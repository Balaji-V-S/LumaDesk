package com.lumadesk.user_service.controller;

import com.lumadesk.user_service.dto.UpdateAddressRequest;
import com.lumadesk.user_service.entities.UserProfile;
import com.lumadesk.user_service.service.UserServiceImpl;
import com.lumadesk.user_service.dto.UpdateEmployeeDetailsRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
public class UserController {

    private final UserServiceImpl userService;

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

    @GetMapping("/api/users/get-profile/{userId}")
    public ResponseEntity<UserProfile> getUserProfileById(@PathVariable Long userId) {
        UserProfile userProfile = userService.getUserProfileById(userId);
        return ResponseEntity.ok(userProfile);
    }

    @PutMapping("/api/users/employee-details")
    public ResponseEntity<UserProfile> updateEmployeeDetails(@Valid @RequestBody UpdateEmployeeDetailsRequest request) {
        UserProfile updatedProfile = userService.updateEmployeeDetails(request);
        return ResponseEntity.ok(updatedProfile);
    }
}
