package com.example.gratisescape.services;

import com.example.gratisescape.models.Viaggio;
import com.example.gratisescape.models.CategoriaViaggio;
import com.example.gratisescape.repositories.ViaggioRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ViaggioService {

    private final ViaggioRepository viaggioRepo;

    public ViaggioService(ViaggioRepository viaggioRepo) {
        this.viaggioRepo = viaggioRepo;
    }

    public List<Viaggio> getAll() {
        return viaggioRepo.findAll();
    }

    public Optional<Viaggio> getById(Long id) {
        return viaggioRepo.findById(id);
    }

    public Viaggio save(Viaggio viaggio) {
        return viaggioRepo.save(viaggio);
    }

    public void delete(Long id) {
        viaggioRepo.deleteById(id);
    }

    public List<Viaggio> searchByNome(String nome) {
        return viaggioRepo.findByNomeContainingIgnoreCase(nome);
    }

    public List<Viaggio> findByCategoria(CategoriaViaggio categoria) {
        return viaggioRepo.findByCategoria(categoria);
    }
}


