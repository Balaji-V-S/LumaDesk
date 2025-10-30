package com.lumadesk.auth_service.client;

import com.lumadesk.auth_service.dto.UserCreationRequest;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Mono;

@Component
public class UserClient {

    private static final Logger log = LoggerFactory.getLogger(UserClient.class);
    private final WebClient webClient;

    // WebClient.Builder is already @LoadBalanced (defined in WebClientConfig)
    public UserClient(WebClient.Builder builder) {
        this.webClient = builder.baseUrl("http://user-service").build();
    }

    /**
     * Creates a user profile by calling the user-service through Eureka discovery.
     */
    public void createUserProfile(UserCreationRequest request) {
        webClient.post()
                .uri("/internal/api/users/create-user-profile")
                .bodyValue(request)
                .retrieve()
                .toBodilessEntity()
                .doOnSuccess(response ->
                        log.info("✅ Successfully created user profile via user-service"))
                .doOnError(error ->
                        log.error("❌ Failed to create user profile via user-service: {}", error.getMessage()))
                .onErrorResume(e -> {
                    // Optional: handle fallback logic here (like retry, message queue, etc.)
                    return Mono.empty();
                })
                .subscribe();
    }
}
