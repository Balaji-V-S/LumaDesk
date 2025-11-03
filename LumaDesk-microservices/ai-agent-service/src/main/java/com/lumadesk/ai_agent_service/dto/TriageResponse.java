package com.lumadesk.ai_agent_service.dto;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class TriageResponse {

    private String severity;
    private String priority;
}
