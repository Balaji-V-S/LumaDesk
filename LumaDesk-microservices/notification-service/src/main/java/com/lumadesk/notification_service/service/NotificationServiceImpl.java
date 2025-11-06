package com.lumadesk.notification_service.service;

import com.lumadesk.notification_service.dto.NotificationRequest;
import com.lumadesk.notification_service.entities.Notification;
import com.lumadesk.notification_service.repository.NotificationRepository;
import lombok.RequiredArgsConstructor;
import com.lumadesk.notification_service.websocket.WebSocketNotificationSender;
import org.springframework.stereotype.Service;
import com.lumadesk.notification_service.entities.enums.NotificationStatus;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class NotificationServiceImpl implements NotificationService {

    private final NotificationRepository notificationRepository;

    private final WebSocketNotificationSender webSocketNotificationSender;

    @Override
    @Transactional
    public Notification createNotification(NotificationRequest request) {
        Notification notification = new Notification();
        notification.setSendTo(request.getSendTo());
        notification.setSentBy(request.getSentBy());
        notification.setSubject(request.getSubject());
        notification.setMessage(request.getMessage());
        notification.setStatus(NotificationStatus.NEW);

        Notification savedNotification = notificationRepository.save(notification);
        sendRealtimeNotification(savedNotification);
        return savedNotification;
    }

    @Override
    @Transactional(readOnly = true)
    public List<Notification> getNotificationsByUserId(String userId) {
        return notificationRepository.findAllBySendTo(userId);
    }
    
    @Override
    @Transactional
    public void sendRealtimeNotification(Notification notification) {
        boolean sent = webSocketNotificationSender.sendNotification(notification);
        notification.setStatus(sent ? NotificationStatus.SENT : NotificationStatus.FAILED);
        notificationRepository.save(notification);
    }
    
    @Override
    @Transactional(readOnly = true)
    public List<Notification> getNotificationsByUserIdAndStatus(String userId, NotificationStatus status) {
        return notificationRepository.findAllBySendToAndStatus(userId, status);
    }
}
