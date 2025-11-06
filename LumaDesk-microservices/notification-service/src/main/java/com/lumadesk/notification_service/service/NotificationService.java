package com.lumadesk.notification_service.service;

import com.lumadesk.notification_service.dto.NotificationRequest;
import com.lumadesk.notification_service.entities.Notification;
import com.lumadesk.notification_service.entities.enums.NotificationStatus;

import java.util.List;

public interface NotificationService {

    Notification createNotification(NotificationRequest request);

    List<Notification> getNotificationsByUserId(String userId);

    void sendRealtimeNotification(Notification notification);

    List<Notification> getNotificationsByUserIdAndStatus(String userId, NotificationStatus status);
}
