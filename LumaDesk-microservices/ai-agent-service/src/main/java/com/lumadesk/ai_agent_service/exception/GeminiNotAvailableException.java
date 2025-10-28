package com.lumadesk.ai_agent_service.exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(HttpStatus.SERVICE_UNAVAILABLE)
public class GeminiNotAvailableException extends RuntimeException {
    public GeminiNotAvailableException(String message) {
        super(message);
    }
}
