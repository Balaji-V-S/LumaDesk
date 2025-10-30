package com.lumadesk.ai_agent_service.dto;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class AgentResponse {
    private String previousContext;
    private String answer;
}
