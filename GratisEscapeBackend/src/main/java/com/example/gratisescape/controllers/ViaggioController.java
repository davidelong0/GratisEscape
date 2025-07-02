package com.example.gratisescape.controllers;

import com.example.gratisescape.dto.ViaggioCreateDTO;
import com.example.gratisescape.dto.ViaggioUpdateDTO;
import com.example.gratisescape.models.Viaggio;
import com.example.gratisescape.models.CategoriaViaggio;
import com.example.gratisescape.services.ViaggioService;
import com.example.gratisescape.utils.CloudinaryUtil;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("/viaggi")
public class ViaggioController {

    private final ViaggioService viaggioService;
    private final CloudinaryUtil cloudinaryUtil;

    public ViaggioController(ViaggioService viaggioService, CloudinaryUtil cloudinaryUtil) {
        this.viaggioService = viaggioService;
        this.cloudinaryUtil = cloudinaryUtil;
    }

    @GetMapping
    public ResponseEntity<List<Viaggio>> getAll() {
        return ResponseEntity.ok(viaggioService.getAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Viaggio> getById(@PathVariable Long id) {
        return viaggioService.getById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/categoria/{categoria}")
    public ResponseEntity<List<Viaggio>> getByCategoria(@PathVariable CategoriaViaggio categoria) {
        return ResponseEntity.ok(viaggioService.findByCategoria(categoria));
    }

    @GetMapping("/search")
    public ResponseEntity<List<Viaggio>> searchByNome(@RequestParam String q) {
        List<Viaggio> risultati = viaggioService.searchByNome(q);
        if (risultati.isEmpty()) {
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.ok(risultati);
    }

    @PostMapping(consumes = {"multipart/form-data"})
    public ResponseEntity<Viaggio> create(@Valid @ModelAttribute ViaggioCreateDTO dto,
                                          @RequestPart(required = false) MultipartFile file) throws IOException {
        String imageUrl = null;
        if (file != null && !file.isEmpty()) {
            imageUrl = cloudinaryUtil.uploadImage(file);
        }

        Viaggio viaggio = Viaggio.builder()
                .nome(dto.nome())
                .descrizione(dto.descrizione())
                .destinazione(dto.destinazione())
                .categoria(dto.categoria())
                .prezzo(dto.prezzo())
                .urlImmagine(imageUrl)
                .build();

        return ResponseEntity.ok(viaggioService.save(viaggio));
    }

    @PutMapping(value = "/{id}", consumes = {"multipart/form-data"})
    public ResponseEntity<Viaggio> update(@PathVariable Long id,
                                          @Valid @ModelAttribute ViaggioUpdateDTO dto,
                                          @RequestPart(required = false) MultipartFile file) throws IOException {
        var existing = viaggioService.getById(id);
        if (existing.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        String imageUrl = existing.get().getUrlImmagine();
        if (file != null && !file.isEmpty()) {
            imageUrl = cloudinaryUtil.uploadImage(file);
        }

        Viaggio viaggio = existing.get();
        viaggio.setNome(dto.nome());
        viaggio.setDescrizione(dto.descrizione());
        viaggio.setDestinazione(dto.destinazione());
        viaggio.setCategoria(dto.categoria());
        viaggio.setPrezzo(dto.prezzo());
        viaggio.setUrlImmagine(imageUrl);

        return ResponseEntity.ok(viaggioService.save(viaggio));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> delete(@PathVariable Long id) {
        if (viaggioService.getById(id).isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        viaggioService.delete(id);
        return ResponseEntity.ok().build();
    }
}

