package com.example.gratisescape.repositories;

import com.example.gratisescape.models.MessaggioChat;
import com.example.gratisescape.models.Richiesta;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

public interface MessaggioChatRepository extends JpaRepository<MessaggioChat, Long> {

    List<MessaggioChat> findByRichiestaOrderByTimestampAsc(Richiesta richiesta);

    @Modifying
    @Transactional
    @Query("DELETE FROM MessaggioChat m WHERE m.richiesta.id = :richiestaId")
    void deleteByRichiestaId(Long richiestaId);


    @Query("SELECT m FROM MessaggioChat m WHERE m.richiesta.id = :richiestaId AND m.mittente <> :mittente AND m.lettoDalDestinatario = false")
    List<MessaggioChat> findUnreadMessages(Long richiestaId, String mittente);

    @Modifying
    @Transactional
    @Query("UPDATE MessaggioChat m SET m.lettoDalDestinatario = true WHERE m.richiesta.id = :richiestaId AND m.mittente <> :mittente")
    void markAsRead(Long richiestaId, String mittente);
}

