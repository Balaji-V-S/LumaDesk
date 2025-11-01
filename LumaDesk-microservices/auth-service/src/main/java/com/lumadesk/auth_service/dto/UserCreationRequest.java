package com.lumadesk.auth_service.dto;

import lombok.*;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class UserCreationRequest {
    private Long userId;
    private String fullName;
    private String email;
    private String phoneNumber;
    private String address;
    private String area;
    private String pinCode;
}
