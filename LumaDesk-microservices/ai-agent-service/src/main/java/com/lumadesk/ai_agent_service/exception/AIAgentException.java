package com.lumadesk.ai_agent_service.exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(HttpStatus.INTERNAL_SERVER_ERROR)
public class AIAgentException extends RuntimeException {
    public AIAgentException(String message, Throwable cause) {
        super(message, cause);
    }
}
