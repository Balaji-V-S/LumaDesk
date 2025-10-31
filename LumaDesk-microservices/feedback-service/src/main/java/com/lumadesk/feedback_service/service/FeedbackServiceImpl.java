package com.lumadesk.feedback_service.service;

import com.lumadesk.feedback_service.dto.FeedbackCreationRequest;
import com.lumadesk.feedback_service.dto.SubmitFeedbackRequest;
import com.lumadesk.feedback_service.entities.Feedback;
import com.lumadesk.feedback_service.entities.enums.FeedbackStatus;
import com.lumadesk.feedback_service.repository.FeedbackRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class FeedbackServiceImpl implements FeedbackService {

    private final FeedbackRepository feedbackRepository;

    @Override
    @Transactional
    public Feedback createPendingFeedback(FeedbackCreationRequest request) {
        if (feedbackRepository.existsByTicketId(request.getTicketId())) {
            throw new IllegalStateException("Feedback for this ticket has already been initiated.");
        }

        Feedback feedback = new Feedback();
        feedback.setTicketId(request.getTicketId());
        feedback.setUserId(request.getUserId()); // Save the customer's user ID
        feedback.setFeedbackStatus(FeedbackStatus.PENDING); // Set default status

        return feedbackRepository.save(feedback);
    }

    @Override
    @Transactional
    public Feedback submitFeedback(SubmitFeedbackRequest request) {
        Feedback feedback = feedbackRepository.findByTicketId(request.getTicketId())
                .orElseThrow(() -> new IllegalStateException("No pending feedback found for this ticket."));

        if (feedback.getFeedbackStatus() == FeedbackStatus.COMPLETED) {
            throw new IllegalStateException("Feedback for this ticket has already been completed.");
        }

        feedback.setRating(request.getRating());
        feedback.setComment(request.getComment());
        feedback.setFeedbackStatus(FeedbackStatus.COMPLETED);

        return feedbackRepository.save(feedback);
    }
}
