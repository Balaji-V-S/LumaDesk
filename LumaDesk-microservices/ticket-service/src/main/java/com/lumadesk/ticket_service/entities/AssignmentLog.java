package com.lumadesk.ticket_service.entities;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "assignment_logs")
@Data
@NoArgsConstructor
public class AssignmentLog {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long assignmentId;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "ticket_id", nullable = false)
    @NotNull(message = "Ticket reference must not be null")
    private Ticket ticket;

    @NotNull(message = "AssignedTo (user ID) must not be null")
    @Positive(message = "AssignedTo (user ID) must be a positive number")
    @Column(nullable = false)
    private Long assignedTo; // User ID of the new assignee

    @NotNull(message = "AssignedBy (user ID) must not be null")
    @Positive(message = "AssignedBy (user ID) must be a positive number")
    @Column(nullable = false)
    private Long assignedBy; // User ID of the person who assigned the ticket

    @CreationTimestamp
    @Column(nullable = false, updatable = false)
    private LocalDateTime assignedAt;
}
