package com.r2u.notification.dto.mapper.Impl;

import org.springframework.stereotype.Component;

import com.r2u.notification.dto.mapper.DeviceNotificationMapper;
import com.r2u.notification.dto.request.DeviceNotificationRequest;
import com.r2u.notification.dto.response.DeviceNotificationResponse;
import com.r2u.notification.entity.DeviceNotification;
import com.r2u.notification.entity.enums.Status;

@Component
public class DeviceNotificationMapperImpl implements DeviceNotificationMapper {

    @Override
    public DeviceNotificationResponse toResponse(DeviceNotification deviceNotification) {
        if (deviceNotification == null) {
            return null;
        }
        return new DeviceNotificationResponse(
                deviceNotification.getId(),
                deviceNotification.getNotificationId(),
                deviceNotification.getDeviceTokenRequest(),
                deviceNotification.getDeviceToken(),
                deviceNotification.getStatus(),
                deviceNotification.getErrorMessage(),
                deviceNotification.getCreatedAt(),
                deviceNotification.getUpdatedAt());
    }

    @Override
    public DeviceNotification toEntity(DeviceNotificationRequest deviceNotificationRequest) {
        if (deviceNotificationRequest == null) {
            return null;
        }
        DeviceNotification deviceNotification = new DeviceNotification();
        deviceNotification.setNotificationId(deviceNotificationRequest.getNotificationId());
        deviceNotification.setDeviceTokenRequest(deviceNotificationRequest.getDeviceTokenRequest());
        deviceNotification.setDeviceToken(deviceNotificationRequest.getDeviceToken());
        deviceNotification.setStatus(Status.PENDING);
        return deviceNotification;
    }
    
}
