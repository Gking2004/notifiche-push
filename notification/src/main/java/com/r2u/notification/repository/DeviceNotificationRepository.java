package com.r2u.notification.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.r2u.notification.entity.DeviceNotification;

@Repository
public interface DeviceNotificationRepository extends JpaRepository<DeviceNotification, Long> {
    Optional<DeviceNotification> findByNotificationIdAndDeviceToken(Long notificationId, String deviceToken);
}
