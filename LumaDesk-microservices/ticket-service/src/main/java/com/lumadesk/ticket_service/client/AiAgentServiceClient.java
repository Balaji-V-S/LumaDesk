package com.lumadesk.ticket_service.client;

import com.lumadesk.ticket_service.dto.TriageRequest;
import com.lumadesk.ticket_service.dto.TriageResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Mono;

@Component
@RequiredArgsConstructor
public class AiAgentServiceClient {

    private final WebClient.Builder webClientBuilder;

    public Mono<TriageResponse> getTriageSuggestion(TriageRequest request) {
        return webClientBuilder.build().post()
                .uri("http://ai-agent-service/api/ai-agent/triage/suggest")
                .bodyValue(request)
                .retrieve()
                .bodyToMono(TriageResponse.class);
    }
}
