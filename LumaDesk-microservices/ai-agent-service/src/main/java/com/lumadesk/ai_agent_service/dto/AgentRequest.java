package com.lumadesk.ai_agent_service.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class AgentRequest {
    private String role;
    private String previousContext;
    private String query;
}
