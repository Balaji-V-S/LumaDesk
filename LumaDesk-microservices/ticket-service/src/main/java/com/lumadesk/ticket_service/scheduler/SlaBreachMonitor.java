package com.lumadesk.ticket_service.scheduler;

import com.lumadesk.ticket_service.client.NotificationServiceClient;
import com.lumadesk.ticket_service.dto.NotificationRequest;
import com.lumadesk.ticket_service.entities.Ticket;
import com.lumadesk.ticket_service.entities.enums.TicketPriority;
import com.lumadesk.ticket_service.entities.enums.TicketStatus;
import com.lumadesk.ticket_service.repository.TicketRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.time.Duration;
import java.time.LocalDateTime;
import java.util.List;

@Component
@RequiredArgsConstructor
@Slf4j
public class SlaBreachMonitor {

    private final TicketRepository ticketRepository;
    private final NotificationServiceClient notificationServiceClient;

    private static final List<TicketStatus> ACTIVE_STATUSES = List.of(
            TicketStatus.NEW,
            TicketStatus.ASSIGNED,
            TicketStatus.IN_PROGRESS,
            TicketStatus.ON_HOLD,
            TicketStatus.REOPENED
    );

    // Check for SLA breaches every 2 minutes
    @Scheduled(fixedRate = 120000)
    public void checkForSlaBreaches() {
        log.info("Running SLA Breach Monitor...");
        List<Ticket> activeTickets = ticketRepository.findByStatusIn(ACTIVE_STATUSES);

        for (Ticket ticket : activeTickets) {
            if (ticket.getSla() == null || ticket.getAssignedTo() == null) {
                continue; // Cannot check SLA without this info
            }

            LocalDateTime now = LocalDateTime.now();
            LocalDateTime creationTime = ticket.getCreatedAt();
            Integer slaHours = ticket.getSla().getTimeLimitHour();
            LocalDateTime breachTime = creationTime.plusHours(slaHours);

            // 1. Check for tickets that have already breached
            if (now.isAfter(breachTime)) {
                if (!ticket.isSlaBreached()) {
                    ticket.setSlaBreached(true);
                    ticketRepository.save(ticket);
                    log.warn("SLA BREACHED for ticket {}!", ticket.getTicketId());
                    sendNotification(ticket, "SLA HAS BEEN BREACHED for ticket " + ticket.getTicketId());
                }
                continue; // Move to the next ticket
            }

            // 2. Check for impending breaches and send tiered warnings
            long minutesUntilBreach = Duration.between(now, breachTime).toMinutes();

            if (minutesUntilBreach <= 5) {
                log.warn("SLA for ticket {} is about to breach in 5 minutes!", ticket.getTicketId());
                sendNotification(ticket, "Urgent: 5 minutes remaining for SLA on ticket " + ticket.getTicketId());
            } else if (minutesUntilBreach <= 10) {
                log.warn("SLA for ticket {} is about to breach in 10 minutes!", ticket.getTicketId());
                sendNotification(ticket, "Warning: 10 minutes remaining for SLA on ticket " + ticket.getTicketId());
            } else if (minutesUntilBreach <= 15) {
                // Set priority to URGENT only once
                if (ticket.getPriority() != TicketPriority.URGENT) {
                    ticket.setPriority(TicketPriority.URGENT);
                    ticketRepository.save(ticket);
                    log.warn("Priority for ticket {} set to URGENT.", ticket.getTicketId());
                }
                sendNotification(ticket, "Warning: 15 minutes remaining for SLA on ticket " + ticket.getTicketId());
            }
        }
        log.info("SLA Breach Monitor finished.");
    }

    private void sendNotification(Ticket ticket, String message) {
        notificationServiceClient.sendNotification(new NotificationRequest(
                String.valueOf(ticket.getAssignedTo()),
                "System-SLA-Monitor",
                "SLA Alert for Ticket: " + ticket.getTicketId(),
                message
        ));
    }
}
