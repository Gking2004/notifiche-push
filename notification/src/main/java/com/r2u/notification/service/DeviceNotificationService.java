package com.r2u.notification.service;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.stereotype.Service;

import com.google.firebase.messaging.FirebaseMessaging;
import com.google.firebase.messaging.FirebaseMessagingException;
import com.google.firebase.messaging.Message;
import com.r2u.notification.dto.mapper.DeviceNotificationMapper;
import com.r2u.notification.dto.request.DeviceNotificationRequest;
import com.r2u.notification.dto.response.DeviceNotificationResponse;
import com.r2u.notification.entity.DeviceEntity;
import com.r2u.notification.entity.DeviceNotification;
import com.r2u.notification.entity.NotificationEntity;
import com.r2u.notification.entity.enums.Status;
import com.r2u.notification.repository.DeviceNotificationRepository;
import com.r2u.notification.repository.DeviceRepository;
import com.r2u.notification.repository.NotificationRepository;
import com.google.firebase.messaging.Notification;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@RequiredArgsConstructor
@Slf4j
public class DeviceNotificationService {
    
    private final DeviceNotificationRepository deviceNotificationRepository;
    private final DeviceNotificationMapper deviceNotificationMapper;
    private final NotificationRepository notificationRepository;
    private final DeviceRepository deviceRepository;

    @Transactional
    public DeviceNotificationResponse createDeviceNotification(DeviceNotificationRequest request) {

    NotificationEntity notification = notificationRepository.findById(request.getNotificationId())
        .orElseThrow(() -> new RuntimeException("Notifica non trovata"));

    DeviceEntity device = deviceRepository.findByDeviceToken(request.getDeviceToken())
    .orElseThrow(() -> new RuntimeException("Device non trovato"));

    if (deviceRepository.findByDeviceToken(request.getDeviceTokenRequest()).isEmpty() ) {
        throw new RuntimeException("Device request non trovato");
    }

    DeviceNotification entity = deviceNotificationMapper.toEntity(request);
    deviceNotificationRepository.save(entity);
    entity.setStatus(Status.PENDING);

    try {
        Message message = Message.builder()
            .setNotification(Notification.builder()
                .setTitle(notification.getTitle())
                .setBody(notification.getBody())
                .build())
            .setToken(device.getDeviceToken())
            .putData("notificationId", String.valueOf(entity.getId()))
            .putData("deviceToken", String.valueOf(entity.getDeviceToken()))
            .putData("deviceTokenRequest", String.valueOf(entity.getDeviceTokenRequest()))
            .putData("type", String.valueOf(notification.getType()))
            .build();

        FirebaseMessaging.getInstance().send(message);
        entity.setStatus(Status.SENT);
        entity.setUpdatedAt(LocalDateTime.now());
    } catch (FirebaseMessagingException e) {
        entity.setStatus(Status.FAILED);
        entity.setErrorMessage(e.getMessage());
        log.error("Errore invio notifica Firebase: {}", e.getMessage());
    }
    deviceNotificationRepository.save(entity);
    return deviceNotificationMapper.toResponse(entity);
}

    public DeviceNotificationResponse findById(Long id) {
        log.info("Finding device notification with id: {}", id);
        return deviceNotificationMapper.toResponse(deviceNotificationRepository.findById(id).orElseThrow());
    }

    public List<DeviceNotificationResponse> findAll() {
        log.info("Finding all device notifications");
        return deviceNotificationRepository.findAll()
                .stream()
                .map(deviceNotificationMapper::toResponse)
                .toList();
    }

    public void deleteById(Long id) {
        log.info("Deleting device notification with id: {}", id);
        deviceNotificationRepository.deleteById(id);
    }
    
}
