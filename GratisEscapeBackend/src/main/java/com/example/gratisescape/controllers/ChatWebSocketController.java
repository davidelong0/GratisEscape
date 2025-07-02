package com.example.gratisescape.controllers;

import com.example.gratisescape.dto.ChatMessage;
import com.example.gratisescape.models.MessaggioChat;
import com.example.gratisescape.services.ChatService;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;

@Controller
public class ChatWebSocketController {

    private final ChatService chatService;
    private final SimpMessagingTemplate messagingTemplate;

    public ChatWebSocketController(ChatService chatService, SimpMessagingTemplate messagingTemplate) {
        this.chatService = chatService;
        this.messagingTemplate = messagingTemplate;
    }

    @MessageMapping("/chat.sendMessage")
    @SendTo("/topic/public")
    public ChatMessage sendMessage(ChatMessage message) {
        MessaggioChat saved = chatService.inviaMessaggio(message.richiestaId(), message.mittente(), message.messaggio());

        return message;
    }
}


