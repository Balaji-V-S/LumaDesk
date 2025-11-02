package com.lumadesk.ticket_service.service;

import com.lumadesk.ticket_service.client.FeedbackServiceClient;
import com.lumadesk.ticket_service.dto.*;
import com.lumadesk.ticket_service.entities.AssignmentLog;
import com.lumadesk.ticket_service.entities.Ticket;
import com.lumadesk.ticket_service.entities.TicketActionLog;
import com.lumadesk.ticket_service.entities.enums.TicketStatus;
import com.lumadesk.ticket_service.exception.ResourceNotFoundException;
import com.lumadesk.ticket_service.repository.AssignmentLogRepository;
import com.lumadesk.ticket_service.repository.IssueCategoryRepository;
import com.lumadesk.ticket_service.repository.TicketActionLogRepository;
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
    private final TicketActionLogRepository ticketActionLogRepository;
    private final FeedbackServiceClient feedbackServiceClient;

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
    public Ticket assignTicketToEngineer(AssignTicketRequest request) {
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

    @Override
    @Transactional
    public Ticket reassignTicket(ReassignTicketRequest request) {
        Ticket ticket = ticketRepository.findById(request.getTicketId())
                .orElseThrow(() -> new ResourceNotFoundException("Ticket not found with ID: " + request.getTicketId()));

        Long oldAssignee = ticket.getAssignedTo();
        ticket.setAssignedTo(request.getNewAssignedToId());
        // The status remains ASSIGNED
        Ticket updatedTicket = ticketRepository.save(ticket);

        // Create an AssignmentLog for the new assignment
        AssignmentLog assignmentLog = new AssignmentLog();
        assignmentLog.setTicket(updatedTicket);
        assignmentLog.setAssignedTo(request.getNewAssignedToId());
        assignmentLog.setAssignedBy(request.getReassignedById());
        assignmentLogRepository.save(assignmentLog);

        // Create a TicketActionLog to record the reassignment action
        TicketActionLog actionLog = new TicketActionLog();
        actionLog.setTicket(updatedTicket);
        actionLog.setUpdatedBy(request.getReassignedById());
        actionLog.setStatus(ticket.getStatus()); // Status at the time of action
        actionLog.setActionNote("Ticket reassigned from user " + oldAssignee + " to user " + request.getNewAssignedToId());
        ticketActionLogRepository.save(actionLog);

        return updatedTicket;
    }

    @Override
    @Transactional
    public Ticket openTicket(OpenTicketRequest request) {
        Ticket ticket = ticketRepository.findById(request.getTicketId())
                .orElseThrow(() -> new ResourceNotFoundException("Ticket not found with ID: " + request.getTicketId()));

        ticket.setStatus(TicketStatus.IN_PROGRESS);
        Ticket updatedTicket = ticketRepository.save(ticket);

        TicketActionLog actionLog = new TicketActionLog();
        actionLog.setTicket(updatedTicket);
        actionLog.setUpdatedBy(request.getEngineerId());
        actionLog.setStatus(TicketStatus.IN_PROGRESS);
        actionLog.setActionNote("Ticket opened by engineer.");
        ticketActionLogRepository.save(actionLog);

        return updatedTicket;
    }

    @Override
    @Transactional
    public Ticket resolveTicket(ResolveTicketRequest request) {
        Ticket ticket = ticketRepository.findById(request.getTicketId())
                .orElseThrow(() -> new ResourceNotFoundException("Ticket not found with ID: " + request.getTicketId()));

        ticket.setStatus(TicketStatus.RESOLVED);
        Ticket updatedTicket = ticketRepository.save(ticket);

        TicketActionLog actionLog = new TicketActionLog();
        actionLog.setTicket(updatedTicket);
        actionLog.setUpdatedBy(request.getEngineerId());
        actionLog.setStatus(TicketStatus.RESOLVED);
        actionLog.setActionNote(request.getActionNote());
        actionLog.setAttachmentUrl(request.getAttachmentUrl());
        ticketActionLogRepository.save(actionLog);

        // TODO: Add WebClient call to feedback-service here

        return updatedTicket;
    }

    @Override
    @Transactional
    public Ticket holdTicket(HoldTicketRequest request) {
        Ticket ticket = ticketRepository.findById(request.getTicketId())
                .orElseThrow(() -> new ResourceNotFoundException("Ticket not found with ID: " + request.getTicketId()));

        ticket.setStatus(TicketStatus.ON_HOLD);
        Ticket updatedTicket = ticketRepository.save(ticket);

        TicketActionLog actionLog = new TicketActionLog();
        actionLog.setTicket(updatedTicket);
        actionLog.setUpdatedBy(request.getEngineerId());
        actionLog.setStatus(TicketStatus.ON_HOLD);
        actionLog.setActionNote(request.getActionNote());
        ticketActionLogRepository.save(actionLog);

        return updatedTicket;
    }

    @Override
    @Transactional
    public Ticket closeTicket(CloseTicketRequest request) {
        Ticket ticket = ticketRepository.findById(request.getTicketId())
                .orElseThrow(() -> new ResourceNotFoundException("Ticket not found with ID: " + request.getTicketId()));

        // Business logic: Only a resolved ticket can be closed
        if (ticket.getStatus() != TicketStatus.RESOLVED) {
            throw new IllegalStateException("Only a resolved ticket can be closed.");
        }

        ticket.setStatus(TicketStatus.CLOSED);
        Ticket updatedTicket = ticketRepository.save(ticket);

        TicketActionLog actionLog = new TicketActionLog();
        actionLog.setTicket(updatedTicket);
        actionLog.setUpdatedBy(request.getCustomerId());
        actionLog.setStatus(TicketStatus.CLOSED);
        actionLog.setActionNote("Ticket closed by customer.");
        ticketActionLogRepository.save(actionLog);

        // Delegate the WebClient call to the dedicated client
        feedbackServiceClient.createPendingFeedback(new FeedbackCreationRequest(ticket.getTicketId(), ticket.getCreatedFor()));

        return updatedTicket;
    }

    @Override
    @Transactional(readOnly = true)
    public List<Ticket> getNewTickets() {
        return ticketRepository.findAllByStatus(TicketStatus.NEW);
    }

    @Override
    @Transactional(readOnly = true)
    public List<Ticket> getTicketsByAssignedTo(Long engineerId) {
        return ticketRepository.findAllByAssignedTo(engineerId);
    }

    @Override
    @Transactional
    public Ticket reopenTicket(ReopenTicketRequest request) {
        Ticket ticket = ticketRepository.findById(request.getTicketId())
                .orElseThrow(() -> new ResourceNotFoundException("Ticket not found with ID: " + request.getTicketId()));

        // Find the last person the ticket was assigned to
        AssignmentLog lastAssignment = assignmentLogRepository.findTopByTicketOrderByAssignedAtDesc(ticket)
                .orElseThrow(() -> new IllegalStateException("Cannot reopen ticket: No previous assignment found."));

        ticket.setStatus(TicketStatus.REOPENED);
        ticket.setAssignedTo(lastAssignment.getAssignedTo()); // Re-assign to the last engineer
        Ticket updatedTicket = ticketRepository.save(ticket);

        // Create a new AssignmentLog for the re-assignment
        AssignmentLog newAssignmentLog = new AssignmentLog();
        newAssignmentLog.setTicket(updatedTicket);
        newAssignmentLog.setAssignedTo(lastAssignment.getAssignedTo());
        newAssignmentLog.setAssignedBy(request.getCustomerId()); // The customer is implicitly the one re-opening
        assignmentLogRepository.save(newAssignmentLog);

        // Create a TicketActionLog to record the reopen action
        TicketActionLog actionLog = new TicketActionLog();
        actionLog.setTicket(updatedTicket);
        actionLog.setUpdatedBy(request.getCustomerId());
        actionLog.setStatus(TicketStatus.REOPENED);
        actionLog.setActionNote("Ticket automatically reopened due to low feedback rating.");
        ticketActionLogRepository.save(actionLog);

        return updatedTicket;
    }
}
