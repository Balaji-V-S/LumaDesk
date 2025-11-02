package com.lumadesk.notification_service.service;

import com.lumadesk.notification_service.dto.NotificationRequest;
import com.lumadesk.notification_service.entities.Notification;
import com.lumadesk.notification_service.repository.NotificationRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class NotificationServiceImpl implements NotificationService {

    private final NotificationRepository notificationRepository;

    @Override
    @Transactional
    public Notification createNotification(NotificationRequest request) {
        Notification notification = new Notification();
        notification.setSendTo(request.getSendTo());
        notification.setSentBy(request.getSentBy());
        notification.setSubject(request.getSubject());
        notification.setMessage(request.getMessage());
        return notificationRepository.save(notification);
    }
}
