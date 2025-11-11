package com.lumadesk.ai_agent_service.service;

import com.lumadesk.ai_agent_service.dto.TriageRequest;
import com.lumadesk.ai_agent_service.dto.TriageResponse;
import com.lumadesk.ai_agent_service.exception.AIAgentException;
import dev.langchain4j.model.googleai.GoogleAiGeminiChatModel;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.when;

class AiTriageServiceImplTest {

    @Mock
    private GoogleAiGeminiChatModel geminiChatModel;

    @InjectMocks
    private AiTriageServiceImpl aiTriageService;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void suggestTriage_shouldReturnTriageResponse_whenGeminiReturnsValidJson() {
        // Given
        TriageRequest request = new TriageRequest("Network", "Internet is down for the whole office.");
        // We mock a plausible JSON response from the AI.
        String geminiResponse = "{\"severity\": \"HIGH\", \"priority\": \"URGENT\"}";
        when(geminiChatModel.chat(anyString())).thenReturn(geminiResponse);

        // When
        TriageResponse response = aiTriageService.suggestTriage(request);

        // Then
        assertNotNull(response, "The response should not be null.");
        assertNotNull(response.getSeverity(), "The severity should not be null.");
        assertFalse(response.getSeverity().isBlank(), "The severity should not be blank.");
        assertNotNull(response.getPriority(), "The priority should not be null.");
        assertFalse(response.getPriority().isBlank(), "The priority should not be blank.");
    }

    @Test
    void suggestTriage_shouldThrowAIAgentException_whenGeminiReturnsInvalidJson() {
        // Given
        TriageRequest request = new TriageRequest("Network", "Internet is slow.");
        String geminiResponse = "This is not a valid JSON";
        when(geminiChatModel.chat(anyString())).thenReturn(geminiResponse);

        // When & Then
        assertThrows(AIAgentException.class, () -> aiTriageService.suggestTriage(request));
    }

    @Test
    void suggestTriage_shouldThrowAIAgentException_whenGeminiThrowsException() {
        // Given
        TriageRequest request = new TriageRequest("Network", "Internet is slow.");
        when(geminiChatModel.chat(anyString())).thenThrow(new RuntimeException("Gemini is down"));

        // When & Then
        assertThrows(AIAgentException.class, () -> aiTriageService.suggestTriage(request));
    }
}
