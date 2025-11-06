package com.lumadesk.notification_service.websocket;

import com.lumadesk.notification_service.entities.Notification;
import lombok.RequiredArgsConstructor;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class WebSocketNotificationSender {

    private final SimpMessagingTemplate messagingTemplate;

    public boolean sendNotification(Notification notification) {
        try {
            messagingTemplate.convertAndSendToUser(
                    notification.getSendTo(),
                    "/queue/notifications",
                    notification
            );
            return true;
        } catch (Exception e) {
            return false;
        }
    }
}
