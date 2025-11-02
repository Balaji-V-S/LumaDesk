package com.lumadesk.ticket_service.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class IssueCategoryCreationRequest {

    @NotBlank(message = "Category name cannot be blank")
    private String categoryName;
}
