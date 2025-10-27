package com.lumadesk.ai_agent_service.controller;

import com.lumadesk.ai_agent_service.services.AiAgentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@CrossOrigin(origins="*")
@RequestMapping("/api/ai-agent")
public class AiAgentController {
    @Autowired
    private AiAgentService geminiChatService;

    @GetMapping("/health") //check the availability of the service
    public String health() {
        return "Gemini Vertex AI microservice is running";
    }

    @PostMapping("/")
    public String chat(@RequestBody String input) {
        return geminiChatService.chatWithGemini(input);
    }
}

