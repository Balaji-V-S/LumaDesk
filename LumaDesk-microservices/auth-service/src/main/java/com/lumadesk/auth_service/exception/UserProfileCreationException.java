package com.lumadesk.auth_service.exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(HttpStatus.SERVICE_UNAVAILABLE)
public class UserProfileCreationException extends RuntimeException {
    public UserProfileCreationException(String message, Throwable cause) {
        super(message, cause);
    }
}
