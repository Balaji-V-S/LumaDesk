package com.lumadesk.notification_service.repository;

import com.lumadesk.notification_service.entities.Notification;
import com.lumadesk.notification_service.entities.enums.NotificationStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface NotificationRepository extends JpaRepository<Notification, Long> {

    List<Notification> findAllBySendTo(String userId);
    List<Notification> findAllBySendToAndStatus(String userId, NotificationStatus status);
}
