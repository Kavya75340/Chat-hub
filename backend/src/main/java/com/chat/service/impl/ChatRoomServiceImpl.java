package com.chat.service.impl;

import java.util.Optional;
import java.util.UUID;

import org.springframework.stereotype.Service;

import com.chat.dto.chat.ChatRoomRequestDTO;
import com.chat.dto.chat.ChatRoomResponseDTO;
import com.chat.entity.ChatRoom;
import com.chat.entity.User;
import com.chat.repository.ChatRoomRepository;
import com.chat.repository.UserRepository;
import com.chat.service.ChatRoomService;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ChatRoomServiceImpl implements ChatRoomService {

    private final ChatRoomRepository chatRoomRepository;
    private final UserRepository userRepository;

        @Override
        public ChatRoomResponseDTO createChatRoom(ChatRoomRequestDTO dto) {

            // check existing chat
            Optional<ChatRoom> existingRoom =
                    chatRoomRepository
                            .findBySenderIdAndReceiverId(
                                    dto.getSenderId(),
                                    dto.getReceiverId()
                            );
                    
            if(existingRoom.isPresent()) {

                ChatRoom room = existingRoom.get();

                return ChatRoomResponseDTO.builder()

                        .chatId(room.getChatId())

                        .senderId(room.getSender().getId())

                        .receiverId(room.getReceiver().getId())

                        .build();
            }

            // reverse check
            Optional<ChatRoom> reverseRoom =
                    chatRoomRepository
                            .findBySenderIdAndReceiverId(
                                    dto.getReceiverId(),
                                    dto.getSenderId()
                            );
                    
            if(reverseRoom.isPresent()) {

                ChatRoom room = reverseRoom.get();

                return ChatRoomResponseDTO.builder()

                        .chatId(room.getChatId())

                        .senderId(room.getSender().getId())

                        .receiverId(room.getReceiver().getId())

                        .build();
            }

    // create new chat
    User sender = userRepository.findById(dto.getSenderId())
            .orElseThrow(() -> new RuntimeException("Sender not found"));

    User receiver = userRepository.findById(dto.getReceiverId())
            .orElseThrow(() -> new RuntimeException("Receiver not found"));

    ChatRoom chatRoom = ChatRoom.builder()

            .chatId(UUID.randomUUID().toString())

            .sender(sender)

            .receiver(receiver)

            .build();

    ChatRoom saved = chatRoomRepository.save(chatRoom);

    return ChatRoomResponseDTO.builder()

            .chatId(saved.getChatId())

            .senderId(saved.getSender().getId())

            .receiverId(saved.getReceiver().getId())

            .build();
}

    @Override
    public String getChatId(Long senderId, Long receiverId) {

        Optional<ChatRoom> existingRoom =
                chatRoomRepository.findBySenderIdAndReceiverId(senderId, receiverId);

        if(existingRoom.isPresent()) {
            return existingRoom.get().getChatId();
        }

        Optional<ChatRoom> reverseRoom =
                chatRoomRepository.findBySenderIdAndReceiverId(receiverId, senderId);

        if(reverseRoom.isPresent()) {
            return reverseRoom.get().getChatId();
        }

        return UUID.randomUUID().toString();
    }
}