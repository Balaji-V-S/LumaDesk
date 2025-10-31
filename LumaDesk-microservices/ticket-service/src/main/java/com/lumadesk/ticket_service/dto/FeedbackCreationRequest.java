package com.lumadesk.ticket_service.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

// This is a data transfer object used for the WebClient call to the feedback-service.
@Data
@NoArgsConstructor
@AllArgsConstructor
public class FeedbackCreationRequest {
    private Long ticketId;
    private Long userId;
}
