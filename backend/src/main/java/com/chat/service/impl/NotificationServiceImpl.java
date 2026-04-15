package com.chat.service.impl;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import com.chat.dto.notification.NotificationDTO;
import com.chat.dto.notification.NotificationResponseDTO;
import com.chat.entity.Notification;
import com.chat.enums.NotificationType;
import com.chat.repository.NotificationRepository;
import com.chat.service.NotificationService;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class NotificationServiceImpl implements NotificationService {

    private final NotificationRepository notificationRepository;

    @Override
    public NotificationResponseDTO create(NotificationDTO dto) {

        Notification notification = Notification.builder()
                .userId(dto.getUserId())
                .message(dto.getMessage())
                .type(
                        dto.getType() != null
                                ? dto.getType()
                                : NotificationType.SYSTEM
                )
                .referenceId(dto.getReferenceId())
                .seen(false)
                .timestamp(LocalDateTime.now())
                .build();

        return map(notificationRepository.save(notification));
    }

    @Override
    public List<NotificationResponseDTO> getUserNotifications(Long userId) {

        return notificationRepository
                .findByUserIdOrderByTimestampDesc(userId)
                .stream()
                .map(this::map)
                .collect(Collectors.toList());
    }

    @Override
    public void markAsSeen(Long id) {

        Notification notification = notificationRepository
                .findById(id)
                .orElseThrow(() -> new RuntimeException("Notification not found"));

        notification.setSeen(true);

        notificationRepository.save(notification);
    }

    @Override
    public long getUnreadCount(Long userId) {

        return notificationRepository
                .countByUserIdAndSeenFalse(userId);
    }

    private NotificationResponseDTO map(Notification n) {

        return NotificationResponseDTO.builder()
                .id(n.getId())
                .userId(n.getUserId())
                .message(n.getMessage())
                .type(n.getType())
                .seen(n.isSeen())
                .timestamp(n.getTimestamp())
                .referenceId(n.getReferenceId())
                .build();
    }
}