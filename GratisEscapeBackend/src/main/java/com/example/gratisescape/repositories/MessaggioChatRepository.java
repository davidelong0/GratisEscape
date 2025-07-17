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
}

