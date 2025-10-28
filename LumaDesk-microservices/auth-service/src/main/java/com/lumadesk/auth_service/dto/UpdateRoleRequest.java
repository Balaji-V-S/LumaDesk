package com.lumadesk.auth_service.dto;

import lombok.Data;

@Data
public class UpdateRoleRequest {
    private Long userId;
    private String role;
}
