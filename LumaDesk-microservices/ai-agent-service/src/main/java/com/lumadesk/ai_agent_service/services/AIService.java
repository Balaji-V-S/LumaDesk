package com.lumadesk.ai_agent_service.services;

import org.springframework.ai.model.generation.*;
import org.springframework.ai.model.generation.GenerationResponse;
import org.springframework.ai.model.generation.TextGenerationModel;
import org.springframework.stereotype.Service;

@Service
public class AIService {

    private TextGenerationModel geminiModel;

    public AIService(TextGenerationModel geminiModel) {
        this.geminiModel = geminiModel;
    }

    public String processInput(String userData) {
        GenerationRequest request = GenerationRequest.builder()
                .input("You are a backend reasoning agent that replies in JSON format only.\nUser: " + userData)
                .temperature(0.2)
                .topP(0.9)
                .maxTokens(512)
                .build();

        GenerationResponse response = geminiModel.generate(request);
        return response.output();
    }
}
