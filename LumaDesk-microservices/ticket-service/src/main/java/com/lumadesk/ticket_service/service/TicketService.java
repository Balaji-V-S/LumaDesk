package com.lumadesk.ticket_service.service;

import com.lumadesk.ticket_service.dto.AgentTicketCreationRequest;
import com.lumadesk.ticket_service.dto.CustTicketCreationRequest;
import com.lumadesk.ticket_service.entities.Ticket;

public interface TicketService {
    Ticket createTicketByCustomer(CustTicketCreationRequest request);
    Ticket createTicketByAgent(AgentTicketCreationRequest request);
}
