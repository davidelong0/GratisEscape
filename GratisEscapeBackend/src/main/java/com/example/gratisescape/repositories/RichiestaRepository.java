package com.example.gratisescape.repositories;

import com.example.gratisescape.models.Richiesta;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface RichiestaRepository extends JpaRepository<Richiesta, Long> {

    List<Richiesta> findByEmailUtente(String emailUtente);
}



