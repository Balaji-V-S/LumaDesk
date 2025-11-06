package com.lumadesk.ai_agent_service.service;

import com.lumadesk.ai_agent_service.dto.AgentRequest;
import com.lumadesk.ai_agent_service.dto.AgentResponse;
import com.lumadesk.ai_agent_service.exception.GeminiNotAvailableException;
import dev.langchain4j.model.googleai.GoogleAiGeminiChatModel;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.when;

class AiAgentServiceImplTest {

    @Mock
    private GoogleAiGeminiChatModel geminiChatModel;

    @InjectMocks
    private AiAgentServiceImpl aiAgentService;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void chatWithGemini_shouldReturnAgentResponse_whenGeminiIsAvailable() {
        // Given
        AgentRequest request = new AgentRequest("ROLE_CUSTOMER", "What is broadband?", "");
        String expectedResponse = "Broadband is a high-speed internet connection.";
        when(geminiChatModel.chat(anyString())).thenReturn(expectedResponse);

        // When
        AgentResponse response = aiAgentService.chatWithGemini(request);

        // Then
        assertNotNull(response);
        assertEquals(expectedResponse, response.getAnswer());
        assertTrue(response.getNewContext().contains(expectedResponse));
    }

    @Test
    void chatWithGemini_shouldThrowException_whenGeminiIsNotAvailable() {
        // Given
        AgentRequest request = new AgentRequest("ROLE_CUSTOMER", "What is broadband?", "");
        when(geminiChatModel.chat(anyString())).thenThrow(new RuntimeException("Gemini is down"));

        // When & Then
        assertThrows(GeminiNotAvailableException.class, () -> aiAgentService.chatWithGemini(request));
    }

    @Test
    void checkGeminiStatus_shouldReturnActive_whenGeminiResponds() {
        // Given
        when(geminiChatModel.chat("Hello")).thenReturn("Hi there!");

        // When
        String status = aiAgentService.checkGeminiStatus();

        // Then
        assertEquals("Gemini model is active and responding.", status);
    }

    @Test
    void checkGeminiStatus_shouldReturnEmptyContent_whenGeminiRespondsWithEmptyString() {
        // Given
        when(geminiChatModel.chat("Hello")).thenReturn("");

        // When
        String status = aiAgentService.checkGeminiStatus();

        // Then
        assertEquals("Gemini model responded with empty content.", status);
    }

    @Test
    void checkGeminiStatus_shouldThrowException_whenGeminiIsNotAvailable() {
        // Given
        when(geminiChatModel.chat("Hello")).thenThrow(new RuntimeException("Gemini is down"));

        // When & Then
        assertThrows(GeminiNotAvailableException.class, () -> aiAgentService.checkGeminiStatus());
    }
}