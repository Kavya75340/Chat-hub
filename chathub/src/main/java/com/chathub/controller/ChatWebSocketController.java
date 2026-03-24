package com.chathub.controller;


import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.stereotype.Controller;

import com.chathub.entity.ChatMessage;

@Controller
public class ChatWebSocketController {

    @MessageMapping("/sendMessage")
    @SendTo("/topic/messages")
    public ChatMessage sendMessage(ChatMessage message) {

        System.out.println("MESSAGE RECEIVED: " + message.getContent());

        return message;
    }
}