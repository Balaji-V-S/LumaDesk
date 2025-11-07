package com.lumadesk.user_service.dto;

import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UpdateEmployeeDetailsRequest {

    @NotNull(message = "User ID cannot be null")
    private Long userId;

    private String employeeId;

    private String teamId;
}
