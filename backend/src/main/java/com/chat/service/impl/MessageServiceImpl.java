package com.chat.service.impl;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import com.chat.dto.message.MessageRequestDTO;
import com.chat.dto.message.MessageResponseDTO;
import com.chat.entity.Message;
import com.chat.entity.User;
import com.chat.enums.MessageType;
import com.chat.repository.MessageRepository;
import com.chat.repository.UserRepository;
import com.chat.service.MessageService;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class MessageServiceImpl implements MessageService {

    private final MessageRepository messageRepository;
    private final UserRepository userRepository;

    @Override
    public MessageResponseDTO sendMessage(MessageRequestDTO dto) {

        User sender = userRepository.findById(dto.getSenderId())
                .orElseThrow(() -> new RuntimeException("Sender not found"));

        User receiver = userRepository.findById(dto.getReceiverId())
                .orElseThrow(() -> new RuntimeException("Receiver not found"));

        Message message = Message.builder()
                .chatId(dto.getChatId())
                .sender(sender)
                .receiver(receiver)
                .content(dto.getContent())
                .timestamp(LocalDateTime.now())
                .seen(false)
                .messageType(
                        dto.getMessageType() != null
                                ? dto.getMessageType()
                                : MessageType.TEXT
                )
                .build();

        Message saved = messageRepository.save(message);

        return mapToDTO(saved);
    }

    @Override
    public List<MessageResponseDTO> getMessages(String chatId) {

        return messageRepository
                .findByChatIdOrderByTimestampAsc(chatId)
                .stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    private MessageResponseDTO mapToDTO(Message message) {

        return MessageResponseDTO.builder()
                .id(message.getId())
                .chatId(message.getChatId())
                .senderId(message.getSender().getId())
                .receiverId(message.getReceiver().getId())
                .content(message.getContent())
                .timestamp(message.getTimestamp())
                .seen(message.isSeen())
                .messageType(message.getMessageType())
                .build();
    }
}