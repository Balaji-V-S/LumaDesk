package com.lumadesk.auth_service.dto;

import lombok.*;

@Setter
@Getter
@AllArgsConstructor
@NoArgsConstructor
public class SignInResponse {
    private String accessToken;
    private String tokenType;
    private String role;
}
