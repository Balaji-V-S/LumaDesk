package com.lumadesk.ai_agent_service.exception;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.context.request.WebRequest;

import java.util.HashMap;
import java.util.Map;

@ControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(GeminiNotAvailableException.class)
    public ResponseEntity<Object> handleGeminiNotAvailableException(
            GeminiNotAvailableException ex, WebRequest request) {
        Map<String, Object> body = new HashMap<>();
        body.put("message", "The AI service is currently unavailable. Please try again later.");
        body.put("error", ex.getMessage());
        return new ResponseEntity<>(body, HttpStatus.SERVICE_UNAVAILABLE);
    }
}
