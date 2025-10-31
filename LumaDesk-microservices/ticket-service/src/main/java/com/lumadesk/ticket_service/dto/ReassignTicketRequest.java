package com.lumadesk.ticket_service.dto;

import jakarta.validation.constraints.NotNull;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ReassignTicketRequest {

    @NotNull(message = "Ticket ID cannot be null")
    private Long ticketId;

    @NotNull(message = "The ID of the user reassigning the ticket cannot be null")
    private Long reassignedById; // The current engineer performing the action

    @NotNull(message = "The ID of the new assignee cannot be null")
    private Long newAssignedToId; // The engineer the ticket is being reassigned to
}
