package com.lumadesk.ai_agent_service.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;
import lombok.NoArgsConstructor;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class TriageRequest {

    @NotBlank(message = "Issue category cannot be blank")
    private String issueCategory;

    @NotBlank(message = "Issue description cannot be blank")
    private String issueDescription;
}
