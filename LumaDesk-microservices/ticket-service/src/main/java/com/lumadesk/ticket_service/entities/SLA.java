package com.lumadesk.ticket_service.entities;

import com.lumadesk.ticket_service.entities.enums.TicketPriority;
import com.lumadesk.ticket_service.entities.enums.TicketSeverity;
import jakarta.persistence.*;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "sla_rules")
@Data
@NoArgsConstructor
public class SLA {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long slaId;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    @NotNull(message = "Severity must not be null")
    private TicketSeverity severity;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    @NotNull(message = "Priority must not be null")
    private TicketPriority priority;

    @NotNull(message = "Time limit (in hours) must not be null")
    @Positive(message = "Time limit must be a positive number")
    @Min(value = 1, message = "Time limit must be at least 1 hour")
    @Max(value = 72, message = "Time limit cannot exceed 72 hours (3 days)")
    @Column(nullable = false)
    private Integer timeLimitHour; // SLA time limit for resolution, in hours
}
