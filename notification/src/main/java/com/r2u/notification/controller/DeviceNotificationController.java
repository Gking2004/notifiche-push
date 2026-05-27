package com.r2u.notification.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.r2u.notification.dto.request.DeviceNotificationRequest;
import com.r2u.notification.service.DeviceNotificationService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@RestController
@RequiredArgsConstructor
@RequestMapping("/device-notifications")
@Slf4j
public class DeviceNotificationController {
    
    private final DeviceNotificationService deviceNotificationService;

    @PostMapping("/send")
    @ResponseStatus(HttpStatus.OK)
    @Operation(summary = "Create a new device notification", description = "Sends a notification to a device via FCM")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Notification sent successfully", content = @Content),
            @ApiResponse(responseCode = "400", description = "Invalid request", content = @Content),
            @ApiResponse(responseCode = "500", description = "Internal server error", content = @Content)
    })
    public ResponseEntity<?> createDeviceNotification(@RequestBody DeviceNotificationRequest deviceNotificationRequest) {
        log.info("POST /device-notifications/send with body: {}", deviceNotificationRequest);
        return ResponseEntity.ok(deviceNotificationService.createDeviceNotification(deviceNotificationRequest));
    }

    @GetMapping("/{id}")
    @ResponseStatus(HttpStatus.OK)
    @Operation(summary = "Get a device notification by ID", description = "Returns the device notification with the specified ID")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Device notification found", content = @Content),
            @ApiResponse(responseCode = "404", description = "Device notification not found", content = @Content),
            @ApiResponse(responseCode = "500", description = "Internal server error", content = @Content)
    })
    public ResponseEntity<?> findById(@PathVariable Long id) {
        log.info("GET /device-notifications/{} with id: {}", id);
        return ResponseEntity.ok(deviceNotificationService.findById(id));
    }

    
}
