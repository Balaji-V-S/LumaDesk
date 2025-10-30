package com.lumadesk.ai_agent_service.dto;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class AgentRequest {
    private String role;
    private String previousContext;
    private String query;
}
