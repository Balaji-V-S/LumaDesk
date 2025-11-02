package com.lumadesk.feedback_service.client;

import com.lumadesk.feedback_service.dto.ReopenTicketRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;
import org.springframework.web.reactive.function.client.WebClient;

@Component
@RequiredArgsConstructor
public class TicketServiceClient {

    private final WebClient.Builder webClientBuilder;

    public void reopenTicket(ReopenTicketRequest request) {
        webClientBuilder.build().put()
                .uri("http://ticket-service/api/tickets/reopen")
                .bodyValue(request)
                .retrieve()
                .bodyToMono(Void.class)
                .subscribe(); // Fire and forget
    }
}
