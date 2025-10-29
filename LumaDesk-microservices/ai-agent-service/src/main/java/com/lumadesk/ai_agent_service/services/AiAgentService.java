package com.lumadesk.ai_agent_service.services;

import com.lumadesk.ai_agent_service.dto.AgentRequest;
import com.lumadesk.ai_agent_service.dto.AgentResponse;

public interface AiAgentService {
    public AgentResponse chatWithGemini(AgentRequest request);
    public String checkGeminiStatus();
}
