package com.lumadesk.ticket_service.repository;

import com.lumadesk.ticket_service.entities.AssignmentLog;
import com.lumadesk.ticket_service.entities.Ticket;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface AssignmentLogRepository extends JpaRepository<AssignmentLog, Long> {

    Optional<AssignmentLog> findTopByTicketOrderByAssignedAtDesc(Ticket ticket);

    List<AssignmentLog> findAllByTicket(Ticket ticket);
}
