package com.lumadesk.feedback_service.entities;

import com.lumadesk.feedback_service.entities.enums.FeedbackStatus;
import jakarta.persistence.*;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.Size;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "feedbacks")
@Data
@NoArgsConstructor
public class Feedback {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long feedbackId;

    @Column(nullable = false, unique = true)
    private Long ticketId;

    @Column(nullable = false)
    private Long userId; // ID of the customer who raised the ticket

    @Min(value = 1, message = "Rating must be at least 1")
    @Max(value = 5, message = "Rating must be at most 5")
    private Integer rating;

    @Size(min=10, max=100, message = "Comment must be between 10 and 100 characters")
    @Column(columnDefinition = "TEXT")
    private String comment;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private FeedbackStatus feedbackStatus;

    @UpdateTimestamp
    private LocalDateTime feedbackTime;
}
