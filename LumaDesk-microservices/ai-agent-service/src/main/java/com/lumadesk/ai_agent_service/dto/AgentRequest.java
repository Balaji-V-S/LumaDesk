package com.lumadesk.ai_agent_service.dto;

import jakarta.annotation.Nullable;
import lombok.Data;

@Data
public class AgentRequest {
    private String role;
    private String previousContext;
    private String query;
}
