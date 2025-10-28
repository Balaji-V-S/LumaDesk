package com.lumadesk.ai_agent_service.services;

import com.lumadesk.ai_agent_service.dto.AgentRequest;
import com.lumadesk.ai_agent_service.dto.AgentResponse;
import com.lumadesk.ai_agent_service.exception.GeminiNotAvailableException;
import dev.langchain4j.model.googleai.GoogleAiGeminiChatModel;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Map;

@Service
public class AiAgentService {

    @Autowired
    private GoogleAiGeminiChatModel geminiChatModel;

    private static final Map<String, String> PROMPT_TEMPLATES = Map.of(
            "ROLE_CUSTOMER",
            "You are a helpful assistant talking to a customer experiencing network issues such as broadband, ethernet, or hardware problems. Answer clearly and simply. Question: %s",

            "ROLE_SUPPORT_AGENT",
            "You are assisting a support agent handling customer tickets involving network diagnostics, hardware replacement, and broadband troubleshooting. Guide with detailed steps and company policies. Question: %s",

            "ROLE_TRIAGE_OFFICER",
            "You assist a triage officer categorizing network tickets by severity and priority based on issue descriptions like connectivity loss, hardware failure, or speed degradation. Provide triaging advice accordingly. Question: %s",

            "ROLE_TECH_SUPPORT_ENGINEER",
            "You are an AI assistant helping a technical support engineer with detailed troubleshooting of broadband, ethernet, and related network hardware issues. Suggest diagnostics, fixes, and escalation tips. Question: %s",

            "ROLE_NOC_ENGINEER",
            "You help a NOC engineer monitoring and resolving network operations issues such as packet loss, switch failures, or outages. Provide network-level diagnostics and remediation suggestions. Question: %s",

            "ROLE_FIELD_ENGINEER",
            "You assist a field engineer working on-site with hardware diagnostics, device replacements, and network connectivity restoration. Guide on proper documentation and customer communication. Question: %s",

            "ROLE_TEAM_LEAD",
            "You support a team lead overseeing network issue resolution and ticket escalations. Offer insights on team workload balancing, SLA adherence, and operational efficiency improvements. Question: %s",

            "ROLE_MANAGER",
            "You assist a manager tracking network support metrics, SLA breaches, and team performance. Provide summaries and recommendations for process improvements. Question: %s",

            "ROLE_NOC_ADMIN",
            "You support a NOC admin monitoring network health dashboards, ticket heatmaps, and trend analysis for network outages and disruptions. Advise on capacity planning and alert system enhancements. Question: %s",

            "ROLE_CXO",
            "You provide a CXO with strategic summaries and insights on network support operations, customer satisfaction, and service reliability. Recommend business-level improvements and investments. Question: %s"
    );

    public AgentResponse chatWithGemini(AgentRequest request) {
        String template = PROMPT_TEMPLATES.getOrDefault(request.getRole(), "You are a virtual assistant. Question: %s");
        String systemMessage = template.replace(" Question: %s", "");

        String history = "";
        if (request.getPreviousContext() != null && !request.getPreviousContext().isEmpty()) {
            history = request.getPreviousContext();
        }

        String prompt = systemMessage + "\n\nHere is the conversation history:\n" + history + "\n\nUser: " + request.getQuery() + "\n\nAI:";

        try {
            String answer = geminiChatModel.chat(prompt);
            String newContext =history + (history.isEmpty()? "" : "\n") + "User: " + request.getQuery() + "\nAI: " + answer;
            return new AgentResponse(newContext, answer);
        } catch (Exception e) {
            throw new GeminiNotAvailableException("Error communicating with Gemini model", e);
        }
    }

    public String checkGeminiStatus() {
        try {
            String response = geminiChatModel.chat("Hello");
            if (response != null && !response.trim().isEmpty()) {
                return "Gemini model is active and responding.";
            } else {
                return "Gemini model responded with empty content.";
            }
        } catch (Exception e) {
            throw new GeminiNotAvailableException("Error connecting to Gemini model", e);
        }
    }
}
