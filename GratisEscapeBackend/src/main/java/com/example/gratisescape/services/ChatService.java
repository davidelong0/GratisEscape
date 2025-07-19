package com.example.gratisescape.services;

import com.example.gratisescape.models.MessaggioChat;
import com.example.gratisescape.models.Richiesta;
import com.example.gratisescape.repositories.MessaggioChatRepository;
import com.example.gratisescape.repositories.RichiestaRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class ChatService {

    private final MessaggioChatRepository chatRepo;
    private final RichiestaRepository richiestaRepo;

    public ChatService(MessaggioChatRepository chatRepo, RichiestaRepository richiestaRepo) {
        this.chatRepo = chatRepo;
        this.richiestaRepo = richiestaRepo;
    }

    public MessaggioChat inviaMessaggio(Long richiestaId, String mittente, String messaggio) {
        Richiesta richiesta = richiestaRepo.findById(richiestaId).orElseThrow();
        MessaggioChat chatMsg = MessaggioChat.builder()
                .richiesta(richiesta)
                .mittente(mittente)
                .messaggio(messaggio)
                .timestamp(LocalDateTime.now())
                .lettoDalDestinatario(false)
                .build();
        return chatRepo.save(chatMsg);
    }

    public List<MessaggioChat> getChatPerRichiesta(Long richiestaId) {
        Richiesta richiesta = richiestaRepo.findById(richiestaId).orElseThrow();
        return chatRepo.findByRichiestaOrderByTimestampAsc(richiesta);
    }

    public List<MessaggioChat> getMessaggiNonLetti(Long richiestaId, String mittente) {
        return chatRepo.findUnreadMessages(richiestaId, mittente);
    }

    public void marcaComeLetti(Long richiestaId, String mittente) {
        chatRepo.markAsRead(richiestaId, mittente);
        // ✅ Marca la richiesta come vista se l'admin la apre
        if ("ADMIN".equalsIgnoreCase(mittente)) {
            richiestaRepo.findById(richiestaId).ifPresent(richiesta -> {
                richiesta.setVistaDaAdmin(true);
                richiestaRepo.save(richiesta);
            });
        }
    }
}

