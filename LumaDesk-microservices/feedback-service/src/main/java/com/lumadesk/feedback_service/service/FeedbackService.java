package com.lumadesk.feedback_service.service;

import com.lumadesk.feedback_service.dto.FeedbackCreationRequest;
import com.lumadesk.feedback_service.dto.SubmitFeedbackRequest;
import com.lumadesk.feedback_service.entities.Feedback;

public interface FeedbackService {

    Feedback createPendingFeedback(FeedbackCreationRequest request);

    Feedback submitFeedback(SubmitFeedbackRequest request);
}
