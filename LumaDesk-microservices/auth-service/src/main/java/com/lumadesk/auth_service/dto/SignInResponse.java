package com.lumadesk.auth_service.dto;

import lombok.*;

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
