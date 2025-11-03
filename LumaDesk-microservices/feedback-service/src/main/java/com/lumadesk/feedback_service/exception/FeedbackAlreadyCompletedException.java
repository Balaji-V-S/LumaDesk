package com.lumadesk.feedback_service.exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(HttpStatus.CONFLICT)
public class FeedbackAlreadyCompletedException extends RuntimeException {
    public FeedbackAlreadyCompletedException(String message) {
        super(message);
    }
}
