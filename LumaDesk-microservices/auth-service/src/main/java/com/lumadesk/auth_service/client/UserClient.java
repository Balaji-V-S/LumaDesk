package com.lumadesk.auth_service.client;

import com.lumadesk.auth_service.dto.UserCreationRequest;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

@FeignClient(name = "user-service")
public interface UserClient {

    @PostMapping("/internal/api/users/create-user-profile")
    void createUserProfile(@RequestBody UserCreationRequest request);
}
