package com.lumadesk.ticket_service.dto;

import com.lumadesk.ticket_service.entities.enums.TicketStatus;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class UpdateStatusRequest {
    private Long ticketId;
    private TicketStatus status;
}
