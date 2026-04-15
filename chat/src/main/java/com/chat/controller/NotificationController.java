package com.chat.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.chat.dto.notification.NotificationDTO;
import com.chat.dto.notification.NotificationResponseDTO;
import com.chat.service.NotificationService;

import lombok.RequiredArgsConstructor;

@RestController

@RequestMapping("/api/notification")

@RequiredArgsConstructor

public class NotificationController {

    private final NotificationService notificationService;

    @PostMapping
    public ResponseEntity<NotificationResponseDTO> create( @RequestBody NotificationDTO dto ) {
        return ResponseEntity.ok(
                notificationService.create(dto)
        );
    }

    @GetMapping("/{userId}")
    public ResponseEntity<List<NotificationResponseDTO>> getUserNotifications( @PathVariable Long userId) {
        return ResponseEntity.ok(
                notificationService.getUserNotifications(userId)
        );
    }

    @PutMapping("/seen/{id}")
    public ResponseEntity<String> markSeen( @PathVariable Long id ) {
        notificationService.markAsSeen(id);
        return ResponseEntity.ok("seen updated");
    }

    @GetMapping("/unread/{userId}")
    public ResponseEntity<Long> unreadCount(@PathVariable Long userId) {
        return ResponseEntity.ok(
                notificationService.getUnreadCount(userId)
        );
    }
}