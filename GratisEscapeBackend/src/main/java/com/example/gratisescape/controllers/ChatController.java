package com.example.gratisescape.controllers;

import com.example.gratisescape.models.MessaggioChat;
import com.example.gratisescape.services.ChatService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/chat")
public class ChatController {

    private final ChatService chatService;

    public ChatController(ChatService chatService) {
        this.chatService = chatService;
    }

    @PostMapping("/{richiestaId}")
    public ResponseEntity<MessaggioChat> inviaMessaggio(@PathVariable Long richiestaId,
                                                        @RequestParam String mittente,
                                                        @RequestParam String messaggio) {
        MessaggioChat msg = chatService.inviaMessaggio(richiestaId, mittente, messaggio);
        return ResponseEntity.ok(msg);
    }

    @GetMapping("/{richiestaId}")
    public ResponseEntity<List<MessaggioChat>> getChat(@PathVariable Long richiestaId) {
        List<MessaggioChat> chat = chatService.getChatPerRichiesta(richiestaId);
        return ResponseEntity.ok(chat);
    }


    @GetMapping("/{richiestaId}/unread")
    public ResponseEntity<List<MessaggioChat>> getNonLetti(@PathVariable Long richiestaId,
                                                           @RequestParam String mittente) {
        List<MessaggioChat> nonLetti = chatService.getMessaggiNonLetti(richiestaId, mittente);
        return ResponseEntity.ok(nonLetti);
    }


    @PutMapping("/{richiestaId}/mark-read")
    public ResponseEntity<Void> marcaComeLetti(@PathVariable Long richiestaId,
                                               @RequestParam String mittente) {
        chatService.marcaComeLetti(richiestaId, mittente);
        return ResponseEntity.ok().build();
    }
}


