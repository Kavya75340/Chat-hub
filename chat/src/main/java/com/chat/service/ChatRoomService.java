package com.chat.service;

import com.chat.dto.chat.ChatRoomRequestDTO;
import com.chat.dto.chat.ChatRoomResponseDTO;

public interface ChatRoomService {

    ChatRoomResponseDTO createChatRoom(ChatRoomRequestDTO dto);

    String getChatId(Long senderId, Long receiverId);
}