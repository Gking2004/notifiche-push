package com.r2u.notification.service;

import org.springframework.stereotype.Service;

import com.r2u.notification.dto.mapper.NotificationMapper;
import com.r2u.notification.dto.request.NotificationRequest;
import com.r2u.notification.dto.response.NotificationResponse;
import com.r2u.notification.exception.NotificationNotFoundException;
import com.r2u.notification.repository.NotificationRepository;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@RequiredArgsConstructor
@Slf4j
public class NotificationService {

    private final NotificationRepository notificationRepository;
    private final NotificationMapper notificationMapper;

    @Transactional
    public NotificationResponse createNotification(NotificationRequest notificationRequest) {
        log.info("Creating notification: {}", notificationRequest);
        return notificationMapper.toResponse(notificationRepository.save(notificationMapper.toEntity(notificationRequest)));
    }

    public NotificationResponse getNotificationById(Long id) {
        log.info("Getting notification with id: {}", id);
        return notificationMapper.toResponse(notificationRepository.findById(id).orElseThrow(() -> NotificationNotFoundException.create(id)));
    }

    
}
