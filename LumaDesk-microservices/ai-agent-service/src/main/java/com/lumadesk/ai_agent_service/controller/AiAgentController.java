package com.lumadesk.ai_agent_service.controller;

import com.lumadesk.ai_agent_service.services.AIService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/ai-agent")
public class AiAgentController {

    @Autowired
    private AIService geminiService;

    public GeminiController(GeminiClientService geminiService) {
        this.geminiService = geminiService;
    }

    @GetMapping("/health") //check the availability of the service
    public String health() {
        return "Gemini Vertex AI microservice is running";
    }

    @PostMapping("/query")
    public String process(@RequestBody String input) {
        return geminiService.processInput(input);
    }
}

