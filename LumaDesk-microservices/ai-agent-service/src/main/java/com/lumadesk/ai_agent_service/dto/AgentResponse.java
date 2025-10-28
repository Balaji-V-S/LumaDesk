package com.lumadesk.ai_agent_service.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AgentResponse {
    private String previousContext;
    private String answer;
}
