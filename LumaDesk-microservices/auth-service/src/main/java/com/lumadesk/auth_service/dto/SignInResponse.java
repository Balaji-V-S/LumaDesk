package com.lumadesk.auth_service.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class SignInResponse {
    private String token;
    private Long userId;
    private String role;
    private String fullName;
}
