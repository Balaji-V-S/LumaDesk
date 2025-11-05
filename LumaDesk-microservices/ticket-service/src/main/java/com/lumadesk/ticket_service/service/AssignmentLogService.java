package com.lumadesk.ticket_service.service;

import com.lumadesk.ticket_service.entities.AssignmentLog;

import java.util.List;

public interface AssignmentLogService {

    List<AssignmentLog> getAssignmentLogsByTicketId(Long ticketId);
}
