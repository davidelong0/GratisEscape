package com.example.gratisescape.controllers;

import com.example.gratisescape.models.Richiesta;
import com.example.gratisescape.services.RichiestaService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/richieste")
public class RichiestaController {

    private final RichiestaService richiestaService;

    public RichiestaController(RichiestaService richiestaService) {
        this.richiestaService = richiestaService;
    }

    @PostMapping
    public ResponseEntity<Richiesta> creaRichiesta(@RequestBody Richiesta richiesta) {
        return ResponseEntity.ok(richiestaService.creaRichiesta(richiesta));
    }

    @GetMapping
    public ResponseEntity<List<Richiesta>> getTutte() {
        return ResponseEntity.ok(richiestaService.getTutte());
    }

    @PostMapping("/{id}/rispondi")
    public ResponseEntity<?> rispondi(@PathVariable Long id, @RequestBody String risposta) {
        var richiestaOpt = richiestaService.getTutte().stream()
                .filter(r -> r.getId().equals(id))
                .findFirst();

        if (richiestaOpt.isEmpty()) return ResponseEntity.notFound().build();

        richiestaService.inviaRisposta(richiestaOpt.get(), risposta);
        return ResponseEntity.ok("Risposta inviata");
    }
}


