package com.chat.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.chat.dto.message.MessageRequestDTO;
import com.chat.dto.message.MessageResponseDTO;
import com.chat.service.MessageService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/message")
@RequiredArgsConstructor
public class MessageController {

    private final MessageService messageService;

    @PostMapping
    public ResponseEntity<MessageResponseDTO> sendMessage(
            @RequestBody MessageRequestDTO dto
    ) {

        return ResponseEntity.ok(
                messageService.sendMessage(dto)
        );
    }

    @GetMapping("/{chatId}")
    public ResponseEntity<List<MessageResponseDTO>> getMessages(
            @PathVariable String chatId
    ) {

        return ResponseEntity.ok(
                messageService.getMessages(chatId)
        );
    }
}