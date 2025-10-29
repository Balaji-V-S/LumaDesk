package com.lumadesk.ticket_service.entities;

import com.lumadesk.ticket_service.entities.enums.TicketStatus;
import jakarta.persistence.*;
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

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "ticket_id", nullable = false)
    private Ticket ticket;

    @Column(nullable = false)
    private Long updatedBy; // User ID of the person performing the action

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private TicketStatus status; // The status at the time of the action

    @Lob
    @Column(columnDefinition = "TEXT")
    private String actionNote;

    private String attachmentUrl;

    @CreationTimestamp
    @Column(nullable = false, updatable = false)
    private LocalDateTime actionTime;
}
