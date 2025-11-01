package com.lumadesk.ai_agent_service.controller;

import com.lumadesk.ai_agent_service.dto.AgentRequest;
import com.lumadesk.ai_agent_service.dto.AgentResponse;
import com.lumadesk.ai_agent_service.services.AiAgentServiceImpl;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@CrossOrigin(origins="*")
@RequiredArgsConstructor
@RequestMapping("/api/ai-agent")
public class AiAgentController {

    private final AiAgentServiceImpl geminiChatService;

    @GetMapping("/health") //check the availability of the service
    public String checkHealth() {
        return geminiChatService.checkGeminiStatus();
    }

    @PostMapping("/")
    public AgentResponse chat(@Valid @RequestBody AgentRequest request) {
        return geminiChatService.chatWithGemini(request);
    }
}
