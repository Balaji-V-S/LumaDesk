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

import java.time.LocalDateTime;
import java.util.List;

@Component
@RequiredArgsConstructor
@Slf4j
public class SlaBreachChecker {

    private final TicketRepository ticketRepository;
    private final NotificationServiceClient notificationServiceClient;

    private static final List<TicketStatus> ACTIVE_STATUSES = List.of(
            TicketStatus.NEW,
            TicketStatus.ASSIGNED,
            TicketStatus.IN_PROGRESS,
            TicketStatus.ON_HOLD
    );

    // Check for SLA breaches every 2 minutes
    @Scheduled(fixedRate = 120000)
    public void checkForSlaBreaches() {
        log.info("Running SLA breach check...");
        List<Ticket> activeTickets = ticketRepository.findByStatusIn(ACTIVE_STATUSES);

        for (Ticket ticket : activeTickets) {
            if (ticket.getSla() == null || ticket.getAssignedTo() == null) {
                continue; // Cannot check SLA without this info
            }

            LocalDateTime creationTime = ticket.getCreatedAt();
            Integer slaHours = ticket.getSla().getTimeLimitHour();
            LocalDateTime breachTime = creationTime.plusHours(slaHours);

            // Notify if the breach time is within the next 30 minutes
            if (LocalDateTime.now().isAfter(breachTime.minusMinutes(15)) && LocalDateTime.now().isBefore(breachTime)) {
                log.warn("SLA for ticket {} is about to breach!", ticket.getTicketId());

                notificationServiceClient.sendNotification(new NotificationRequest(
                        String.valueOf(ticket.getAssignedTo()),
                        "System",
                        "SLA Breach Warning for Ticket: " + ticket.getTicketId(),
                        "Warning: The SLA for ticket " + ticket.getTicketId() + " is due to breach at " + breachTime + ". Please take immediate action."
                ));

                ticket.setPriority(TicketPriority.URGENT);
                ticketRepository.save(ticket);
            }
        }
        log.info("SLA breach check finished.");
    }
}
