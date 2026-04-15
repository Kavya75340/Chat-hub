package com.chat.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.chat.dto.chat.ChatRoomRequestDTO;
import com.chat.dto.chat.ChatRoomResponseDTO;
import com.chat.service.ChatRoomService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/chatroom")
@RequiredArgsConstructor
public class ChatRoomController {

    private final ChatRoomService chatRoomService;

    @PostMapping
    public ResponseEntity<ChatRoomResponseDTO> createChatRoom(
            @RequestBody ChatRoomRequestDTO dto
    ) {

        return ResponseEntity.ok(
                chatRoomService.createChatRoom(dto)
        );
    }
}
