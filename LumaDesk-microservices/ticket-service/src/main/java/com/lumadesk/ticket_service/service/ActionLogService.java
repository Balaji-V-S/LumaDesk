package com.lumadesk.ticket_service.service;

import com.lumadesk.ticket_service.entities.TicketActionLog;

import java.util.List;

public interface ActionLogService {

    List<TicketActionLog> getActionLogsByTicketId(Long ticketId);
}
