package com.lumadesk.auth_service.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UserCreationRequest {
    private Long userId;
    private String fullName;
    private String email;
    private String phoneNumber;
    private String address;
    private String pinCode;
}
