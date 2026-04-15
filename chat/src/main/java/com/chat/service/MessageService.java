package com.chat.service;

import java.util.List;

import com.chat.dto.message.MessageRequestDTO;
import com.chat.dto.message.MessageResponseDTO;

public interface MessageService {

    MessageResponseDTO sendMessage(MessageRequestDTO dto);

    List<MessageResponseDTO> getMessages(String chatId);

}