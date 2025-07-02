package com.example.gratisescape.repositories;

import com.example.gratisescape.models.MessaggioChat;
import com.example.gratisescape.models.Richiesta;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface MessaggioChatRepository extends JpaRepository<MessaggioChat, Long> {
    List<MessaggioChat> findByRichiestaOrderByTimestampAsc(Richiesta richiesta);
}

