package com.lumadesk.ticket_service.repository;

import com.lumadesk.ticket_service.entities.Ticket;
import com.lumadesk.ticket_service.entities.TicketActionLog;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TicketActionLogRepository extends JpaRepository<TicketActionLog, Long> {

    List<TicketActionLog> findAllByTicket(Ticket ticket);
}
