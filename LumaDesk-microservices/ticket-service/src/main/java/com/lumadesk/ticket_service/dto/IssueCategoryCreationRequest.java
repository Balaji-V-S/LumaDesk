package com.lumadesk.ticket_service.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class IssueCategoryCreationRequest {

    @NotBlank(message = "Category name cannot be blank")
    private String categoryName;
}
