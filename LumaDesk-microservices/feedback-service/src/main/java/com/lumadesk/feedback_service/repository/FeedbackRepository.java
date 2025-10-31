package com.lumadesk.feedback_service.repository;

import com.lumadesk.feedback_service.entities.Feedback;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface FeedbackRepository extends JpaRepository<Feedback, Long> {
    boolean existsByTicketId(Long ticketId);
    Optional<Feedback> findByTicketId(Long ticketId);
}
