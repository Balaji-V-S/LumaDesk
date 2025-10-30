package com.lumadesk.ticket_service.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class IssueCategoryUpdationRequest {

    @NotNull(message = "Category ID cannot be null")
    private Long categoryId;

    @NotBlank(message = "Category name cannot be blank")
    private String categoryName;
}
