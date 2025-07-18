package com.example.gratisescape.controllers;

import com.example.gratisescape.dto.ChatMessage;
import com.example.gratisescape.models.MessaggioChat;
import com.example.gratisescape.models.Richiesta;
import com.example.gratisescape.services.ChatService;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.stereotype.Controller;

@Controller
public class ChatWebSocketController {

    private final ChatService chatService;

    public ChatWebSocketController(ChatService chatService) {
        this.chatService = chatService;
    }

    @MessageMapping("/chat.sendMessage")
    @SendTo("/topic/public")
    public ChatMessage sendMessage(ChatMessage message) {
        MessaggioChat saved = chatService.inviaMessaggio(
                message.richiestaId(),
                message.mittente(),
                message.messaggio()
        );

        Richiesta richiesta = saved.getRichiesta();

        // ✅ Determina il destinatario in base al mittente
        String destinatario = message.mittente().equals("ADMIN")
                ? richiesta.getEmailUtente()        // Se l'admin scrive, notifica l'utente
                : "ADMIN";                          // Se l'utente scrive, notifica l'admin

        return new ChatMessage(
                message.richiestaId(),
                message.mittente(),
                message.messaggio(),
                destinatario
        );
    }
}



