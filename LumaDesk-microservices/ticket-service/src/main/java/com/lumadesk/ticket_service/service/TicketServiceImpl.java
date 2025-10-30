package com.lumadesk.ticket_service.service;

import com.lumadesk.ticket_service.dto.AgentTicketCreationRequest;
import com.lumadesk.ticket_service.dto.AssignTicketRequest;
import com.lumadesk.ticket_service.dto.UpdateStatusRequest;
import com.lumadesk.ticket_service.dto.CustTicketCreationRequest;
import com.lumadesk.ticket_service.entities.AssignmentLog;
import com.lumadesk.ticket_service.entities.Ticket;
import com.lumadesk.ticket_service.entities.enums.TicketStatus;
import com.lumadesk.ticket_service.exception.ResourceNotFoundException;
import com.lumadesk.ticket_service.repository.AssignmentLogRepository;
import com.lumadesk.ticket_service.repository.IssueCategoryRepository;
import com.lumadesk.ticket_service.repository.TicketRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;

@Service
@RequiredArgsConstructor
public class TicketServiceImpl implements TicketService {

    private final TicketRepository ticketRepository;
    private final IssueCategoryRepository issueCategoryRepository;
    private final AssignmentLogRepository assignmentLogRepository;

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

    @Override
    @Transactional
    public List<Ticket> getTicketsByCustomerId(Long custId){
        List<Ticket> tickets=ticketRepository.findAllByCreatedFor(custId);
        return tickets;
    }

    @Override
    @Transactional
    public String updateTicketStatus(UpdateStatusRequest request){
        Ticket ticket = ticketRepository.findById(request.getTicketId())
                .orElseThrow(() -> new ResourceNotFoundException("Ticket not found"));
        ticket.setStatus(request.getStatus());
        ticketRepository.save(ticket);
        return "Status changed successfully";
    }

    @Override
    @Transactional
    public Ticket assignTicketToAgent(AssignTicketRequest request) {
        Ticket ticket = ticketRepository.findById(request.getTicketId())
                .orElseThrow(() -> new ResourceNotFoundException("Ticket not found with ID: " + request.getTicketId()));
        ticket.setAssignedTo(request.getAssignedTo());
        ticket.setStatus(TicketStatus.ASSIGNED);
        Ticket updatedTicket = ticketRepository.save(ticket);
        AssignmentLog log = new AssignmentLog();
        log.setTicket(updatedTicket);
        log.setAssignedTo(request.getAssignedTo());
        log.setAssignedBy(request.getAssignedBy());
        assignmentLogRepository.save(log);
        return updatedTicket;
    }
}
