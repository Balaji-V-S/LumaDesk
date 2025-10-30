package com.lumadesk.ticket_service.dto;

import com.lumadesk.ticket_service.entities.enums.TicketPriority;
import com.lumadesk.ticket_service.entities.enums.TicketSeverity;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class SLACreationRequest {
    private TicketSeverity severity;
    private TicketPriority priority;
    private Integer timeLimitHour;
}
