package com.lumadesk.ticket_service.controller;

import com.lumadesk.ticket_service.dto.*;
import com.lumadesk.ticket_service.entities.Ticket;
import com.lumadesk.ticket_service.service.TicketService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@CrossOrigin(origins="*")
@RequestMapping("/api/tickets")
@RequiredArgsConstructor
public class TicketController {

    private final TicketService ticketService;

    @GetMapping("/get/{customerId}")
    public ResponseEntity<List<Ticket>> getTicketsByCustId(@PathVariable Long customerId){
        List<Ticket> customerTickets=ticketService.getTicketsByCustomerId(customerId);
        return ResponseEntity.ok(customerTickets);
    }

    @PutMapping("/update-status")
    public ResponseEntity<String> updateTicketStatus(@Valid @RequestBody UpdateStatusRequest request)  {
        String response=ticketService.updateTicketStatus(request);
        return ResponseEntity.ok(response);
    }

    @PutMapping("/assign")
    public ResponseEntity<Ticket> assignTicketToEngineer(@Valid @RequestBody AssignTicketRequest request) {
        Ticket updatedTicket = ticketService.assignTicketToEngineer(request);
        return ResponseEntity.ok(updatedTicket);
    }

    @PutMapping("/reassign")
    public ResponseEntity<Ticket> reassignTicket(@Valid @RequestBody ReassignTicketRequest request) {
        Ticket updatedTicket = ticketService.reassignTicket(request);
        return ResponseEntity.ok(updatedTicket);
    }

    @PutMapping("/open")
    public ResponseEntity<Ticket> openTicket(@Valid @RequestBody OpenTicketRequest request) {
        Ticket updatedTicket = ticketService.openTicket(request);
        return ResponseEntity.ok(updatedTicket);
    }

    @PutMapping("/resolve")
    public ResponseEntity<Ticket> resolveTicket(@Valid @RequestBody ResolveTicketRequest request) {
        Ticket updatedTicket = ticketService.resolveTicket(request);
        return ResponseEntity.ok(updatedTicket);
    }

    @PutMapping("/hold")
    public ResponseEntity<Ticket> holdTicket(@Valid @RequestBody HoldTicketRequest request) {
        Ticket updatedTicket = ticketService.holdTicket(request);
        return ResponseEntity.ok(updatedTicket);
    }

    @PutMapping("/close")
    public ResponseEntity<Ticket> closeTicket(@Valid @RequestBody CloseTicketRequest request) {
        Ticket updatedTicket = ticketService.closeTicket(request);
        return ResponseEntity.ok(updatedTicket);
    }

    @GetMapping("/new")
    public ResponseEntity<List<Ticket>> getNewTickets() {
        List<Ticket> newTickets = ticketService.getNewTickets();
        return ResponseEntity.ok(newTickets);
    }

    @GetMapping("/assigned-to/{engineerId}")
    public ResponseEntity<List<Ticket>> getTicketsByAssignedTo(@PathVariable Long engineerId) {
        List<Ticket> assignedTickets = ticketService.getTicketsByAssignedTo(engineerId);
        return ResponseEntity.ok(assignedTickets);
    }

    @PutMapping("/reopen")
    public ResponseEntity<Ticket> reopenTicket(@Valid @RequestBody ReopenTicketRequest request) {
        Ticket updatedTicket = ticketService.reopenTicket(request);
        return ResponseEntity.ok(updatedTicket);
    }
}
