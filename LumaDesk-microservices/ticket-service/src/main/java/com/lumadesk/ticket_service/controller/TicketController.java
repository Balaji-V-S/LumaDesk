package com.lumadesk.ticket_service.controller;

import com.lumadesk.ticket_service.dto.AgentTicketCreationRequest;
import com.lumadesk.ticket_service.dto.CustTicketCreationRequest;
import com.lumadesk.ticket_service.entities.Ticket;
import com.lumadesk.ticket_service.service.TicketService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@CrossOrigin(origins = "*")
@RequiredArgsConstructor
@RequestMapping("/api/raise-tickets")
public class TicketController {

    private TicketService ticketService;

    @PostMapping("/customer")
    public ResponseEntity<Ticket> createTicketByCustomer(@Valid @RequestBody CustTicketCreationRequest request) {
        Ticket createdTicket = ticketService.createTicketByCustomer(request);
        return ResponseEntity.ok(createdTicket);
    }

    @PostMapping("/agent")
    public ResponseEntity<Ticket> createTicketByAgent(@Valid @RequestBody AgentTicketCreationRequest request) {
        Ticket createdTicket = ticketService.createTicketByAgent(request);
        return ResponseEntity.ok(createdTicket);
    }
}
