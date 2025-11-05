package com.lumadesk.ticket_service.service;

import com.lumadesk.ticket_service.entities.AssignmentLog;
import com.lumadesk.ticket_service.entities.Ticket;
import com.lumadesk.ticket_service.exception.ResourceNotFoundException;
import com.lumadesk.ticket_service.repository.AssignmentLogRepository;
import com.lumadesk.ticket_service.repository.TicketRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class AssignmentLogServiceImpl implements AssignmentLogService {

    private final AssignmentLogRepository assignmentLogRepository;
    private final TicketRepository ticketRepository;

    @Override
    @Transactional(readOnly = true)
    public List<AssignmentLog> getAssignmentLogsByTicketId(Long ticketId) {
        Ticket ticket = ticketRepository.findById(ticketId)
                .orElseThrow(() -> new ResourceNotFoundException("Ticket not found with ID: " + ticketId));
        return assignmentLogRepository.findAllByTicket(ticket);
    }
}
