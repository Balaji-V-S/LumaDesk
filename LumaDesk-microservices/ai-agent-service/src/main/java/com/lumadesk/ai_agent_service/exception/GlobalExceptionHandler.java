package com.lumadesk.ai_agent_service.exception;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.context.request.WebRequest;

import java.util.HashMap;
import java.util.Map;

@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(GeminiNotAvailableException.class)
    public ResponseEntity<Object> handleGeminiNotAvailableException(
            GeminiNotAvailableException ex, WebRequest request) {
        Map<String, Object> body = new HashMap<>();
        body.put("message", "The AI service is currently unavailable. Please try again later.");
        body.put("error", ex.getMessage());
        return new ResponseEntity<>(body, HttpStatus.SERVICE_UNAVAILABLE);
    }

    @ExceptionHandler(AIAgentException.class)
    public ResponseEntity<Object> aiAgentException(
            AIAgentException ex, WebRequest request) {
        Map<String, Object> body = new HashMap<>();
        body.put("message", "AI Triaging cannot be done at the moment.");
        body.put("error", ex.getMessage());
        return new ResponseEntity<>(body, HttpStatus.SERVICE_UNAVAILABLE);
    }
}
