package com.lumadesk.ticket_service.controller;

import com.lumadesk.ticket_service.dto.UpdateStatusRequest;
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
}
