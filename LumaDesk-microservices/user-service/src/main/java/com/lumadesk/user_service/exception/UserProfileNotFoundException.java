package com.lumadesk.user_service.exception;

public class UserProfileNotFoundException extends RuntimeException{
    public UserProfileNotFoundException(String message){
        super(message);
    }
}
