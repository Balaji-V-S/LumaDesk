package com.lumadesk.feedback_service.dto;

import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class FeedbackCreationRequest {

    @NotNull(message = "Ticket ID cannot be null")
    private Long ticketId;

    @NotNull(message = "User ID cannot be null")
    private Long userId;
}
