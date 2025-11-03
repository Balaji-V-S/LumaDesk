package com.lumadesk.ai_agent_service.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.lumadesk.ai_agent_service.dto.TriageRequest;
import com.lumadesk.ai_agent_service.dto.TriageResponse;
import com.lumadesk.ai_agent_service.exception.AIAgentException;
import dev.langchain4j.model.googleai.GoogleAiGeminiChatModel;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AiTriageServiceImpl implements AiTriageService {

    private final GoogleAiGeminiChatModel geminiChatModel;
    private final ObjectMapper objectMapper = new ObjectMapper();

    @Override
    public TriageResponse suggestTriage(TriageRequest request) {
        String prompt = buildPrompt(request);

        try {
            String aiResponse = geminiChatModel.chat(prompt);
            return parseResponse(aiResponse);
        } catch (Exception e) {
            throw new AIAgentException("Failed to get triage suggestion from AI model", e);
        }
    }

    private String buildPrompt(TriageRequest request) {
        return "You are an expert IT support Triage Officer. Based on the following ticket information, " +
                "suggest a severity and priority. The possible severity levels are LOW, MEDIUM, HIGH, CRITICAL. " +
                "The possible priority levels are LOW, MEDIUM, HIGH, URGENT. " +
                "Return ONLY a valid JSON object (not code block, not markdown, not explanation) " +
                "with two keys: \"severity\" and \"priority\".\n\n" +
                "Issue Category: " + request.getIssueCategory() + "\n" +
                "Issue Description: " + request.getIssueDescription();
    }

    private TriageResponse parseResponse(String jsonResponse) {
        try {
            String cleaned = jsonResponse
                    .replaceAll("(?s)```json", "")  // remove ```json
                    .replaceAll("(?s)```", "")      // remove remaining ```
                    .replaceAll("[\\n\\r]", "")     // remove newlines
                    .trim();
            return objectMapper.readValue(cleaned, TriageResponse.class);
        } catch (Exception e) {
            throw new AIAgentException("Failed to parse AI response: " + jsonResponse, e);
        }
    }
}
