package com.lumadesk.feedback_service.controller;

import com.lumadesk.feedback_service.dto.FeedbackCreationRequest;
import com.lumadesk.feedback_service.dto.SubmitFeedbackRequest;
import com.lumadesk.feedback_service.entities.Feedback;
import com.lumadesk.feedback_service.service.FeedbackService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/feedback")
@RequiredArgsConstructor
public class FeedbackController {

    private final FeedbackService feedbackService;

    /**
     * Internal endpoint for the Ticket Service to create a pending feedback entry.
     * This should not be exposed to the public via the API Gateway.
     */
    @PostMapping("/internal/create")
    public ResponseEntity<Feedback> createPendingFeedback(@Valid @RequestBody FeedbackCreationRequest request) {
        Feedback feedback = feedbackService.createPendingFeedback(request);
        return ResponseEntity.ok(feedback);
    }

    /**
     * Public endpoint for customers to submit their feedback.
     */
    @PutMapping("/submit")
    public ResponseEntity<Feedback> submitFeedback(@Valid @RequestBody SubmitFeedbackRequest request) {
        Feedback feedback = feedbackService.submitFeedback(request);
        return ResponseEntity.ok(feedback);
    }
}
