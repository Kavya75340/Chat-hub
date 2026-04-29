package com.chat.service.impl;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

import com.chat.dto.message.MessageRequestDTO;
import com.chat.dto.message.MessageResponseDTO;
import com.chat.entity.ChatRoom;
import com.chat.entity.Message;
import com.chat.entity.User;
import com.chat.enums.MessageStatus;
import com.chat.enums.MessageType;
import com.chat.repository.ChatRoomRepository;
import com.chat.repository.MessageRepository;
import com.chat.repository.UserRepository;
import com.chat.service.MessageService;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class MessageServiceImpl implements MessageService {

    private SimpMessagingTemplate messagingTemplate;
    private final MessageRepository messageRepository;
    private final UserRepository userRepository;
    private final ChatRoomRepository chatRoomRepository;

    @Override
public MessageResponseDTO sendMessage(MessageRequestDTO dto, String phoneNumber) {

    validateUserInChat(dto.getChatId(), phoneNumber);

    User sender = userRepository
            .findByPhoneNumber(phoneNumber)
            .orElseThrow(() -> new RuntimeException("Sender not found"));

    User receiver = null;

    boolean isScheduled =
            Boolean.TRUE.equals(dto.getScheduled()) &&
            dto.getScheduledTime() != null;

    if (Boolean.TRUE.equals(dto.getScheduled())) {

        if (dto.getScheduledTime() == null) {
            throw new RuntimeException("Scheduled time required");
        }

        if (dto.getScheduledTime().isBefore(LocalDateTime.now())) {
            throw new RuntimeException("Scheduled time must be future");
        }
    }

    if (dto.getReceiverId() != null) {
        receiver = userRepository.findById(dto.getReceiverId())
                .orElseThrow(() -> new RuntimeException("Receiver not found"));
    }

    Message message = Message.builder()
            .chatId(dto.getChatId())
            .sender(sender)
            .receiver(receiver)
            .content(dto.getContent())
            .timestamp(isScheduled
                    ? dto.getScheduledTime()
                    : LocalDateTime.now())
            .status(MessageStatus.SENT)
            .messageType(
                    dto.getMessageType() != null
                            ? dto.getMessageType()
                            : MessageType.TEXT
            )
            .scheduled(isScheduled)
            .scheduledTime(dto.getScheduledTime())
            .build();

    Message saved = messageRepository.save(message);

    if (isScheduled) {
        return mapToDTO(saved);
    }
    MessageResponseDTO response = mapToDTO(saved);

    messagingTemplate.convertAndSend(
            "/topic/messages/" + dto.getChatId(),
            response
    );

    return response;
}
    private void validateUserInChat(String chatId, String phone) {

    User user = userRepository
            .findByPhoneNumber(phone)
            .orElseThrow(() -> new RuntimeException("User not found"));

    ChatRoom chat = chatRoomRepository
            .findByChatId(chatId)
            .orElseThrow(() -> new RuntimeException("Chat not found"));

    if (!chat.getUser1().getId().equals(user.getId()) &&
        !chat.getUser2().getId().equals(user.getId())) {

        throw new RuntimeException("Unauthorized access");
    }
    }

    @Override
    public List<MessageResponseDTO> getMessages(String chatId , String phoneNumber) {
        validateUserInChat(chatId, phoneNumber);
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
                .receiverId(
                        message.getReceiver()!=null
                                ? message.getReceiver().getId()
                                : null
                )
                .content(message.getContent())
                .timestamp(message.getTimestamp())
                .messageType(message.getMessageType())
                .status(message.getStatus())
                .scheduled(message.getScheduled())
                .scheduledTime(message.getScheduledTime())
    
                .build();
    }

    @Override
    public void markDelivered(String chatId, String phoneNumber){
    
        validateUserInChat(chatId, phoneNumber); // 🔥 ADD THIS
    
        User user = userRepository.findByPhoneNumber(phoneNumber).orElseThrow();
    
        List<Message> messages = messageRepository.findByChatId(chatId);
    
        messages.forEach(m -> {
            if (!m.getSender().getId().equals(user.getId())) {
                if (m.getStatus() == MessageStatus.SENT) {
                    m.setStatus(MessageStatus.DELIVERED);
                }
            }
        });
    
        messageRepository.saveAll(messages);
    }

    @Override
    public void markSeen(String chatId,String phoneNumber){
    
        validateUserInChat(chatId, phoneNumber); // 🔥 ADD THIS
    
        User user = userRepository.findByPhoneNumber(phoneNumber).orElseThrow();
    
        List<Message> messages = messageRepository.findByChatId(chatId);
    
        messages.forEach(m -> {
            if (!m.getSender().getId().equals(user.getId())) {
                if (m.getStatus() != MessageStatus.SEEN) {
                    m.setStatus(MessageStatus.SEEN);
                }
            }
        });
    
        messageRepository.saveAll(messages);
    }

    @Override
    public void deleteMessage(Long id, String phoneNumber) {
    
        Message message = messageRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Message not found"));
    
        User user = userRepository.findByPhoneNumber(phoneNumber).orElseThrow();
    
        if (!message.getSender().getId().equals(user.getId())) {
            throw new RuntimeException("Not allowed");
        }
    
        messageRepository.delete(message);
    
        messagingTemplate.convertAndSend(
                "/topic/messages/" + message.getChatId(),
                "DELETE:" + id
        );
    }
    @Override
    public MessageResponseDTO editMessage(Long id, MessageRequestDTO dto, String phoneNumber) {
    
        Message message = messageRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Message not found"));
    
        User user = userRepository.findByPhoneNumber(phoneNumber).orElseThrow();
    
        if (!message.getSender().getId().equals(user.getId())) {
            throw new RuntimeException("Not allowed");
        }
    
        message.setContent(dto.getContent());
    
        Message updated = messageRepository.save(message);
    
        MessageResponseDTO response = mapToDTO(updated);
    
        messagingTemplate.convertAndSend(
                "/topic/messages/" + message.getChatId(),
                response
        );
    
        return response;
    }
}