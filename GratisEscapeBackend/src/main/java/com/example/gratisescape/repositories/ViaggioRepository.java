package com.example.gratisescape.repositories;

import com.example.gratisescape.models.Viaggio;
import com.example.gratisescape.models.CategoriaViaggio;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface ViaggioRepository extends JpaRepository<Viaggio, Long> {
    List<Viaggio> findByNomeContainingIgnoreCase(String nome);
    List<Viaggio> findByCategoria(CategoriaViaggio categoria);
}


