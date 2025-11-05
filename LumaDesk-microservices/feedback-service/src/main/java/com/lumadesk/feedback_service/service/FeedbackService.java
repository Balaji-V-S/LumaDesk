package com.lumadesk.feedback_service.service;

import com.lumadesk.feedback_service.dto.FeedbackCreationRequest;
import com.lumadesk.feedback_service.dto.SubmitFeedbackRequest;
import com.lumadesk.feedback_service.entities.Feedback;

import java.util.List;

public interface FeedbackService {

    Feedback createPendingFeedback(FeedbackCreationRequest request);

    Feedback submitFeedback(SubmitFeedbackRequest request);

    List<Feedback> getFeedbackByUserId(Long userId);
}
