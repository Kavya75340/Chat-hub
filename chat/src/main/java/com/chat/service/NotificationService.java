package com.chat.service;

import java.util.List;

import com.chat.dto.notification.NotificationDTO;
import com.chat.dto.notification.NotificationResponseDTO;

public interface NotificationService {

    NotificationResponseDTO create(NotificationDTO dto);

    List<NotificationResponseDTO> getUserNotifications(Long userId);

    void markAsSeen(Long notificationId);

    long getUnreadCount(Long userId);
}