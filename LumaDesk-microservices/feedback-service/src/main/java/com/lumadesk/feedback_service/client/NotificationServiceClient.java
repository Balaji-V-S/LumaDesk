package com.lumadesk.feedback_service.client;

import com.lumadesk.feedback_service.dto.NotificationRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;
import org.springframework.web.reactive.function.client.WebClient;

@Component
@RequiredArgsConstructor
public class NotificationServiceClient {

    private final WebClient.Builder webClientBuilder;

    public void sendNotification(NotificationRequest request) {
        webClientBuilder.build().post()
                .uri("http://notification-service/internal/api/notifications/send")
                .bodyValue(request)
                .retrieve()
                .bodyToMono(Void.class)
                .subscribe(); // Fire and forget
    }
}
