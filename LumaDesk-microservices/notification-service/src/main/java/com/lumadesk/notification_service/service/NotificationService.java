package com.lumadesk.notification_service.service;

import com.lumadesk.notification_service.dto.NotificationRequest;
import com.lumadesk.notification_service.entities.Notification;

public interface NotificationService {

    Notification createNotification(NotificationRequest request);
}
