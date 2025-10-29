package com.lumadesk.ticket_service.entities;

import com.lumadesk.ticket_service.entities.enums.TicketPriority;
import com.lumadesk.ticket_service.entities.enums.TicketSeverity;
import com.lumadesk.ticket_service.entities.enums.TicketStatus;
import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "tickets")
@Data
@NoArgsConstructor
public class Ticket {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long ticketId;

    @Column(nullable = false)
    private Long createdBy; // User ID from auth-service

    @Column(nullable = false)
    private Long createdFor; // User ID, same as createdBy if self-reported

    @Column(nullable = false, columnDefinition = "TEXT")
    private String issueDescription;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private TicketStatus status;

    @Enumerated(EnumType.STRING)
    private TicketSeverity severity;

    @Enumerated(EnumType.STRING)
    private TicketPriority priority;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "issue_category_id")
    private IssueCategory issueCategory;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "sla_id")
    private SLA sla;

    private Long assignedTo; // User ID of the resolver

    @CreationTimestamp
    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(nullable = false)
    private LocalDateTime updatedAt;
}
