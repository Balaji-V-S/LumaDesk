package com.lumadesk.ai_agent_service.configuration;

import dev.langchain4j.model.chat.request.ResponseFormat;
import dev.langchain4j.model.googleai.GoogleAiGeminiChatModel;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.List;

@Configuration
public class AgentConfiguration {
    @Value("${langchain4j.google-ai.api-key}")
    private String apiKey;

    @Value("${langchain4j.google-ai.model-name}")
    private String modelName;

    @Bean
    public GoogleAiGeminiChatModel geminiChatModel() {
        return GoogleAiGeminiChatModel.builder()
                .apiKey(apiKey)
                .modelName(modelName)
                .responseFormat(ResponseFormat.TEXT)
                .build();
    }
}

