package com.lumadesk.auth_service.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class SignInResponse {
    private String token;
    private Long userId;
    private String role;
    private String fullName;
}
