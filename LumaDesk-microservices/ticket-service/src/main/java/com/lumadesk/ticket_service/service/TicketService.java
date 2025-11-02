package com.lumadesk.ticket_service.service;

import com.lumadesk.ticket_service.dto.*;
import com.lumadesk.ticket_service.entities.Ticket;

import java.util.List;

public interface TicketService {
    Ticket createTicketByCustomer(CustTicketCreationRequest request);
    Ticket createTicketByAgent(AgentTicketCreationRequest request);
    List<Ticket> getTicketsByCustomerId(Long custId);
    String updateTicketStatus(UpdateStatusRequest request);
    Ticket assignTicketToEngineer(AssignTicketRequest request);
    Ticket reassignTicket(ReassignTicketRequest request);
    Ticket openTicket(OpenTicketRequest request);
    Ticket resolveTicket(ResolveTicketRequest request);
    Ticket holdTicket(HoldTicketRequest request);
    Ticket closeTicket(CloseTicketRequest request);
    List<Ticket> getNewTickets();
    List<Ticket> getTicketsByAssignedTo(Long engineerId);
    Ticket reopenTicket(ReopenTicketRequest request);
}
