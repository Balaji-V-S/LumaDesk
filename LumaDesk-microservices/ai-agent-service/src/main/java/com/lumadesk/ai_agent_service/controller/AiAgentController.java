package com.lumadesk.ai_agent_service.controller;

import com.lumadesk.ai_agent_service.dto.AgentRequest;
import com.lumadesk.ai_agent_service.dto.AgentResponse;
import com.lumadesk.ai_agent_service.services.AiAgentServiceImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@CrossOrigin(origins="http://localhost:8080/")
@RequestMapping("/api/ai-agent")
public class AiAgentController {
    @Autowired
    private AiAgentServiceImpl geminiChatService;

    @GetMapping("/health") //check the availability of the service
    public String checkHealth() {
        return geminiChatService.checkGeminiStatus();
    }

    @PostMapping("/")
    public AgentResponse chat(@RequestBody AgentRequest request) {
        return geminiChatService.chatWithGemini(request);
    }
}
