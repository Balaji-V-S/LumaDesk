package com.lumadesk.feedback_service.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ReopenTicketRequest {
    private Long ticketId;
    private Long customerId;
}
