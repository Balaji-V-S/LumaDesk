package com.lumadesk.auth_service.dto;

import lombok.*;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class SignInRequest {
        private String email;
        private String password;
}
