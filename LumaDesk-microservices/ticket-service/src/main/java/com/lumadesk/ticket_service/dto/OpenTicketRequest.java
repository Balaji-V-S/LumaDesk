package com.lumadesk.ticket_service.dto;

import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class OpenTicketRequest {

    @NotNull(message = "Ticket ID cannot be null")
    private Long ticketId;

    @NotNull(message = "Engineer ID cannot be null")
    private Long engineerId; // The ID of the engineer opening the ticket
}
