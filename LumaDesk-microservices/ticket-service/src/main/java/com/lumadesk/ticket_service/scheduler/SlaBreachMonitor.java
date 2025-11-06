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

    @Scheduled(fixedRate = 300000)
    public void checkForSlaBreaches() {
        log.info("Running SLA Breach Monitor...");
        List<Ticket> activeTickets = ticketRepository.findByStatusIn(ACTIVE_STATUSES);

        LocalDateTime now = LocalDateTime.now();
        for (Ticket ticket : activeTickets) {
            if (!isTicketEligibleForSlaCheck(ticket)) continue;

            LocalDateTime breachTime = ticket.getCreatedAt().plusHours(ticket.getSla().getTimeLimitHour());
            if (handleSlaBreachIfOccurred(ticket, now, breachTime)) continue;

            handleImpendingSlaBreach(ticket, now, breachTime);
        }
        log.info("SLA Breach Monitor finished.");
    }

    private boolean isTicketEligibleForSlaCheck(Ticket ticket) {
        return ticket.getSla() != null && ticket.getAssignedTo() != null;
    }

    private boolean handleSlaBreachIfOccurred(Ticket ticket, LocalDateTime now, LocalDateTime breachTime) {
        if (now.isAfter(breachTime)) {
            if (!ticket.isSlaBreached()) {
                markTicketAsBreached(ticket);
                sendNotification(ticket, "SLA HAS BEEN BREACHED for ticket " + ticket.getTicketId());
            }
            return true; // stop further processing for this ticket
        }
        return false;
    }

    private void handleImpendingSlaBreach(Ticket ticket, LocalDateTime now, LocalDateTime breachTime) {
        long minutesUntilBreach = Duration.between(now, breachTime).toMinutes();

        if (minutesUntilBreach <= 5) {
            sendWarning(ticket, 5, "Urgent: 5 minutes remaining for SLA on ticket ");
        } else if (minutesUntilBreach <= 10) {
            sendWarning(ticket, 10, "Warning: 10 minutes remaining for SLA on ticket ");
        } else if (minutesUntilBreach <= 15) {
            upgradePriorityIfNeeded(ticket);
            sendWarning(ticket, 15, "Warning: 15 minutes remaining for SLA on ticket ");
        }
    }

    private void markTicketAsBreached(Ticket ticket) {
        ticket.setPriority(TicketPriority.URGENT);
        ticket.setSlaBreached(true);
        ticketRepository.save(ticket);
        log.warn("SLA BREACHED for ticket {}!", ticket.getTicketId());
    }

    private void upgradePriorityIfNeeded(Ticket ticket) {
        if (ticket.getPriority() != TicketPriority.URGENT) {
            ticket.setPriority(TicketPriority.URGENT);
            ticketRepository.save(ticket);
            log.warn("Priority for ticket {} set to URGENT.", ticket.getTicketId());
        }
    }

    private void sendWarning(Ticket ticket, int minutes, String messagePrefix) {
        log.warn("SLA for ticket {} is about to breach in {} minutes!", ticket.getTicketId(), minutes);
        sendNotification(ticket, messagePrefix + ticket.getTicketId());
    }

    private void sendNotification(Ticket ticket, String message) {
        notificationServiceClient.sendNotification(new NotificationRequest(
                String.valueOf(ticket.getAssignedTo()),
                "System-SLA-Monitor",
                "SLA Alert for Ticket: " + ticket.getTicketId(),
                message
        ));
        log.info("Alert has been sent to the assigned engineer.");
    }
}
