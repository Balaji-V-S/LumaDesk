package com.lumadesk.ticket_service.dto;

import com.lumadesk.ticket_service.entities.SLA;
import com.lumadesk.ticket_service.entities.enums.TicketPriority;
import com.lumadesk.ticket_service.entities.enums.TicketSeverity;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class TriageAssignTicketRequest {

    @NotNull(message = "Ticket ID cannot be null")
    private Long ticketId;

    @NotNull(message = "SLA cannot be null")
    private SLA sla;

    @NotNull(message = "Priority cannot be null")
    private TicketPriority priority;

    @NotNull(message = "Severity cannot be null")
    private TicketSeverity severity;

    @NotNull(message = "Assigned To User ID cannot be null")
    private Long assignedTo; //Engineer Id

    @NotNull(message = "Assignee Id cannot be null")
    private Long assignedBy; // Assignee Id
}
