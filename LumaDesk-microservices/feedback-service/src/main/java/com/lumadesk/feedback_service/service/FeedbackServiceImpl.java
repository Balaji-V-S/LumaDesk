package com.lumadesk.feedback_service.service;

import com.lumadesk.feedback_service.client.NotificationServiceClient;
import com.lumadesk.feedback_service.client.TicketServiceClient;
import com.lumadesk.feedback_service.dto.FeedbackCreationRequest;
import com.lumadesk.feedback_service.dto.NotificationRequest;
import com.lumadesk.feedback_service.dto.ReopenTicketRequest;
import com.lumadesk.feedback_service.dto.SubmitFeedbackRequest;
import com.lumadesk.feedback_service.entities.Feedback;
import com.lumadesk.feedback_service.entities.enums.FeedbackStatus;
import com.lumadesk.feedback_service.exception.FeedbackAlreadyCompletedException;
import com.lumadesk.feedback_service.exception.FeedbackAlreadyExistsException;
import com.lumadesk.feedback_service.exception.ResourceNotFoundException;
import com.lumadesk.feedback_service.repository.FeedbackRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class FeedbackServiceImpl implements FeedbackService {

    private final FeedbackRepository feedbackRepository;
    private final TicketServiceClient ticketServiceClient;
    private final NotificationServiceClient notificationServiceClient;

    @Override
    @Transactional
    public Feedback createPendingFeedback(FeedbackCreationRequest request) {
        // This check is now slightly different. We should check if a PENDING feedback already exists.
        if (feedbackRepository.findByTicketIdAndFeedbackStatus(request.getTicketId(), FeedbackStatus.PENDING).isPresent()) {
            throw new FeedbackAlreadyExistsException("A pending feedback request for ticket ID " + request.getTicketId() + " already exists.");
        }

        Feedback feedback = new Feedback();
        feedback.setTicketId(request.getTicketId());
        feedback.setUserId(request.getUserId());
        feedback.setFeedbackStatus(FeedbackStatus.PENDING);

        return feedbackRepository.save(feedback);
    }

    @Override
    @Transactional
    public Feedback submitFeedback(SubmitFeedbackRequest request) {
        // Find the specific PENDING feedback for this ticket.
        Feedback feedback = feedbackRepository.findByTicketIdAndFeedbackStatus(request.getTicketId(), FeedbackStatus.PENDING)
                .orElseThrow(() -> new ResourceNotFoundException("No pending feedback found for ticket ID: " + request.getTicketId()));

        // This check is still valid, but the query above is more precise.
        if (feedback.getFeedbackStatus() == FeedbackStatus.COMPLETED) {
            throw new FeedbackAlreadyCompletedException("Feedback for ticket ID " + request.getTicketId() + " has already been completed.");
        }

        feedback.setRating(request.getRating());
        feedback.setComment(request.getComment());
        feedback.setFeedbackStatus(FeedbackStatus.COMPLETED);

        Feedback savedFeedback = feedbackRepository.save(feedback);

        if (savedFeedback.getRating() <= 2) {
            ticketServiceClient.reopenTicket(new ReopenTicketRequest(savedFeedback.getTicketId(), savedFeedback.getUserId()));
        }

        notificationServiceClient.sendNotification(new NotificationRequest(
                String.valueOf(savedFeedback.getUserId()),
                "System",
                "Feedback Received for Ticket: " + savedFeedback.getTicketId(),
                "Thank you for your feedback!"
        ));

        return savedFeedback;
    }

    @Override
    @Transactional(readOnly = true)
    public List<Feedback> getFeedbackByUserId(Long userId) {
        return feedbackRepository.findAllByUserId(userId);
    }
}
