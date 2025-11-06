package com.lumadesk.feedback_service.exception;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.context.request.WebRequest;

import java.util.HashMap;
import java.util.Map;

@RestControllerAdvice
public class GlobalExceptionHandler {

    public static final String MSG="message";

    @ExceptionHandler(ResourceNotFoundException.class)
    public ResponseEntity<Object> handleResourceNotFoundException(ResourceNotFoundException ex, WebRequest request) {
        Map<String, Object> body = new HashMap<>();
        body.put(MSG, ex.getMessage());
        return new ResponseEntity<>(body, HttpStatus.NOT_FOUND);
    }

    @ExceptionHandler(FeedbackAlreadyExistsException.class)
    public ResponseEntity<Object> handleFeedbackAlreadyExistsException(FeedbackAlreadyExistsException ex, WebRequest request) {
        Map<String, Object> body = new HashMap<>();
        body.put(MSG, ex.getMessage());
        return new ResponseEntity<>(body, HttpStatus.CONFLICT);
    }

    @ExceptionHandler(FeedbackAlreadyCompletedException.class)
    public ResponseEntity<Object> handleFeedbackAlreadyCompletedException(FeedbackAlreadyCompletedException ex, WebRequest request) {
        Map<String, Object> body = new HashMap<>();
        body.put(MSG, ex.getMessage());
        return new ResponseEntity<>(body, HttpStatus.CONFLICT);
    }
}
