package com.lumadesk.notification_service.controller;

import com.lumadesk.notification_service.entities.Notification;
import com.lumadesk.notification_service.entities.enums.NotificationStatus;
import com.lumadesk.notification_service.service.NotificationService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/notifications")
@RequiredArgsConstructor
public class UserNotificationController {

    private final NotificationService notificationService;

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<Notification>> getNotificationsByUserId(@PathVariable String userId) {
        List<Notification> notifications = notificationService.getNotificationsByUserId(userId);
        return ResponseEntity.ok(notifications);
    }

    @GetMapping("/user/{userId}/{status}")
    public ResponseEntity<List<Notification>> getNotificationsByUserIdAndStatus(@PathVariable String userId, @PathVariable NotificationStatus status) {
        List<Notification> notifications = notificationService.getNotificationsByUserIdAndStatus(userId, status);
        return ResponseEntity.ok(notifications);
    }
}
