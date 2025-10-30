package com.lumadesk.ticket_service.dto;

import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AssignTicketRequest {

    @NotNull(message = "Ticket ID cannot be null")
    private Long ticketId;

    @NotNull(message = "Assigned To User ID cannot be null")
    private Long assignedTo; //Engineer Id

    @NotNull(message = "Assignee Id cannot be null")
    private Long assignedBy; // Assignee Id
}
