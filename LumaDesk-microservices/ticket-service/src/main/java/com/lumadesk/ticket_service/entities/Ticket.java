package com.lumadesk.ticket_service.entities;

import com.lumadesk.ticket_service.entities.enums.TicketPriority;
import com.lumadesk.ticket_service.entities.enums.TicketSeverity;
import com.lumadesk.ticket_service.entities.enums.TicketStatus;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
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

    @NotNull(message = "CreatedBy (user ID) must not be null")
    @Positive(message = "CreatedBy (user ID) must be a positive number")
    @Column(nullable = false)
    private Long createdBy; // User ID from auth-service

    @NotNull(message = "CreatedFor (user ID) must not be null")
    @Positive(message = "CreatedFor (user ID) must be a positive number")
    @Column(nullable = false)
    private Long createdFor; // User ID, same as createdBy if self-reported

    @NotBlank(message = "Issue description must not be blank")
    @Column(nullable = false, columnDefinition = "TEXT")
    private String issueDescription;

    @Enumerated(EnumType.STRING)
    @NotNull(message = "Ticket status must not be null")
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

    @Positive(message = "AssignedTo (resolver ID) must be a positive number")
    private Long assignedTo; // ID of the resolver

    @CreationTimestamp
    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(nullable = false)
    private LocalDateTime updatedAt;
}
