package com.lumadesk.ticket_service.service;

import com.lumadesk.ticket_service.entities.Ticket;
import com.lumadesk.ticket_service.entities.TicketActionLog;
import com.lumadesk.ticket_service.exception.ResourceNotFoundException;
import com.lumadesk.ticket_service.repository.TicketActionLogRepository;
import com.lumadesk.ticket_service.repository.TicketRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ActionLogServiceImpl implements ActionLogService {

    private final TicketActionLogRepository actionLogRepository;
    private final TicketRepository ticketRepository;

    @Override
    @Transactional(readOnly = true)
    public List<TicketActionLog> getActionLogsByTicketId(Long ticketId) {
        Ticket ticket = ticketRepository.findById(ticketId)
                .orElseThrow(() -> new ResourceNotFoundException("Ticket not found with ID: " + ticketId));
        return actionLogRepository.findAllByTicket(ticket);
    }
}
