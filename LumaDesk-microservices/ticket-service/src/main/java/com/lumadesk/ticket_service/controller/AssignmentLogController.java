package com.lumadesk.ticket_service.controller;

import com.lumadesk.ticket_service.entities.AssignmentLog;
import com.lumadesk.ticket_service.service.AssignmentLogService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/logs/assignment")
@RequiredArgsConstructor
public class AssignmentLogController {

    private final AssignmentLogService assignmentLogService;

    @GetMapping("/{ticketId}")
    public ResponseEntity<List<AssignmentLog>> getAssignmentLogs(@PathVariable Long ticketId) {
        List<AssignmentLog> logs = assignmentLogService.getAssignmentLogsByTicketId(ticketId);
        return ResponseEntity.ok(logs);
    }
}
