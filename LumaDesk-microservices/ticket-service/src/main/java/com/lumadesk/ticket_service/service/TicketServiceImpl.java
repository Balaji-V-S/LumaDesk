package com.lumadesk.ticket_service.service;

import com.lumadesk.ticket_service.dto.AgentTicketCreationRequest;
import com.lumadesk.ticket_service.dto.CustTicketCreationRequest;
import com.lumadesk.ticket_service.entities.IssueCategory;
import com.lumadesk.ticket_service.entities.Ticket;
import com.lumadesk.ticket_service.entities.enums.TicketStatus;
import com.lumadesk.ticket_service.exception.ResourceNotFoundException;
import com.lumadesk.ticket_service.repository.IssueCategoryRepository;
import com.lumadesk.ticket_service.repository.TicketRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class TicketServiceImpl implements TicketService {

    private final TicketRepository ticketRepository;
    private final IssueCategoryRepository issueCategoryRepository;

    @Override
    @Transactional
    public Ticket createTicketByCustomer(CustTicketCreationRequest request) {
        Ticket ticket = new Ticket();
        ticket.setCreatedBy(request.getCustomerUserId());
        ticket.setCreatedFor(request.getCustomerUserId()); // Customer creates for themselves
        ticket.setIssueCategory(request.getIssueCategory());
        ticket.setIssueDescription(request.getIssueDescription());
        ticket.setStatus(TicketStatus.NEW); // Default status
        return ticketRepository.save(ticket);
    }

    @Override
    @Transactional
    public Ticket createTicketByAgent(AgentTicketCreationRequest request) {
        Ticket ticket = new Ticket();
        ticket.setCreatedBy(request.getAgentUserId());
        ticket.setCreatedFor(request.getCustomerUserId()); // Agent creates for a customer
        ticket.setIssueCategory(request.getIssueCategory());
        ticket.setIssueDescription(request.getIssueDescription());
        ticket.setStatus(TicketStatus.NEW);
        return ticketRepository.save(ticket);
    }
}
