package com.lumadesk.ai_agent_service.services;

import dev.langchain4j.model.googleai.GoogleAiGeminiChatModel;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class AiAgentService {
    private final GoogleAiGeminiChatModel geminiChatModel;

    @Autowired
    public AiAgentService(GoogleAiGeminiChatModel geminiChatModel) {
        this.geminiChatModel = geminiChatModel;
    }

    public String chatWithGemini(String message) {
        return geminiChatModel.chat(message);
    }
}