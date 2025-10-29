package com.lumadesk.ticket_service.entities;

import com.lumadesk.ticket_service.entities.enums.TicketPriority;
import com.lumadesk.ticket_service.entities.enums.TicketSeverity;
import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "slas")
@Data
@NoArgsConstructor
public class SLA {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long slaId;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private TicketSeverity severity;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private TicketPriority priority;

    @Column(nullable = false)
    private Integer timeLimitHour;
}
