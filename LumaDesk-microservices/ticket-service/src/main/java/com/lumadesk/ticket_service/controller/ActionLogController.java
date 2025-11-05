package com.lumadesk.ticket_service.controller;

import com.lumadesk.ticket_service.entities.TicketActionLog;
import com.lumadesk.ticket_service.service.ActionLogService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/logs/action")
@RequiredArgsConstructor
public class ActionLogController {

    private final ActionLogService actionLogService;

    @GetMapping("/{ticketId}")
    public ResponseEntity<List<TicketActionLog>> getActionLogs(@PathVariable Long ticketId) {
        List<TicketActionLog> logs = actionLogService.getActionLogsByTicketId(ticketId);
        return ResponseEntity.ok(logs);
    }
}
