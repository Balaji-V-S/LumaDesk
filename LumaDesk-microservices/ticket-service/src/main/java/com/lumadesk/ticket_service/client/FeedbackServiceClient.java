package com.lumadesk.ticket_service.client;

import com.lumadesk.ticket_service.dto.FeedbackCreationRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;
import org.springframework.web.reactive.function.client.WebClient;

@Component
@RequiredArgsConstructor
public class FeedbackServiceClient {

    private final WebClient.Builder webClientBuilder;

    public void createPendingFeedback(FeedbackCreationRequest request) {
        webClientBuilder.build().post()
                .uri("http://feedback-service/api/feedback/internal/create")
                .bodyValue(request)
                .retrieve()
                .bodyToMono(Void.class)
                .subscribe(); // Fire and forget
    }
}
