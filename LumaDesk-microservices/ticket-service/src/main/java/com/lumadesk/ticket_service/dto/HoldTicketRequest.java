package com.lumadesk.ticket_service.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class HoldTicketRequest {

    @NotNull(message = "Ticket ID cannot be null")
    private Long ticketId;

    @NotNull(message = "Engineer ID cannot be null")
    private Long engineerId;

    @NotBlank(message = "Action note cannot be blank")
    private String actionNote; // Reason for putting the ticket on hold
}
