package com.lumadesk.ticket_service.entities;

import com.lumadesk.ticket_service.entities.enums.TicketStatus;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.Size;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "ticket_action_logs")
@Data
@NoArgsConstructor
public class TicketActionLog {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long actionId;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "ticket_id", nullable = false)
    @NotNull(message = "Ticket reference must not be null")
    private Ticket ticket;

    @NotNull(message = "UpdatedBy (user ID) must not be null")
    @Positive(message = "UpdatedBy (user ID) must be a positive number")
    @Column(nullable = false)
    private Long updatedBy;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    @NotNull(message = "Status must not be null")
    private TicketStatus status;

    @Size(min=10, max=200, message="Action note must be between 10 and 200 characters")
    @Column(columnDefinition = "TEXT")
    private String actionNote;

    @Column(length = 512)
    private String attachmentUrl;

    @CreationTimestamp
    @Column(nullable = false, updatable = false)
    private LocalDateTime actionTime;
}
