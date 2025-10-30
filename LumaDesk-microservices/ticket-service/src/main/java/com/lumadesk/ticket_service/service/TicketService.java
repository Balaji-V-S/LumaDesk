package com.lumadesk.ticket_service.service;

import com.lumadesk.ticket_service.dto.AgentTicketCreationRequest;
import com.lumadesk.ticket_service.dto.AssignTicketRequest;
import com.lumadesk.ticket_service.dto.UpdateStatusRequest;
import com.lumadesk.ticket_service.dto.CustTicketCreationRequest;
import com.lumadesk.ticket_service.entities.Ticket;
import java.util.List;

public interface TicketService {
    Ticket createTicketByCustomer(CustTicketCreationRequest request);
    Ticket createTicketByAgent(AgentTicketCreationRequest request);
    List<Ticket> getTicketsByCustomerId(Long custId);
    String updateTicketStatus(UpdateStatusRequest request);
    Ticket assignTicketToAgent(AssignTicketRequest request);
}
