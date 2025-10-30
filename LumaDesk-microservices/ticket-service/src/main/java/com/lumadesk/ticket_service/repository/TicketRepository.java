package com.lumadesk.ticket_service.repository;

import com.lumadesk.ticket_service.entities.Ticket;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TicketRepository extends JpaRepository<Ticket, Long> {
    List<Ticket> findAllByCreatedFor(Long custId);
}
