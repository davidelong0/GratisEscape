package com.example.gratisescape.controllers;

import com.example.gratisescape.dto.RispostaDTO;
import com.example.gratisescape.models.Richiesta;
import com.example.gratisescape.services.RichiestaService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
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
    public ResponseEntity<Richiesta> creaRichiesta(@RequestBody Richiesta richiesta, Authentication authentication) {
        // Imposta l'email dell'utente autenticato direttamente da Spring Security
        String emailUtente = authentication.getName();
        richiesta.setEmailUtente(emailUtente);

        Richiesta saved = richiestaService.creaRichiesta(richiesta);
        return ResponseEntity.ok(saved);
    }


    @GetMapping
    public ResponseEntity<List<Richiesta>> getTutte() {
        return ResponseEntity.ok(richiestaService.getTutte());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Richiesta> getById(@PathVariable Long id) {
        Richiesta richiesta = richiestaService.getById(id);
        return ResponseEntity.ok(richiesta);
    }

    @PostMapping("/{id}/rispondi")
    public ResponseEntity<?> rispondi(@PathVariable Long id, @RequestBody RispostaDTO rispostaDTO) {
        Richiesta richiesta = richiestaService.getById(id);
        richiestaService.inviaRisposta(richiesta, rispostaDTO.risposta());
        return ResponseEntity.ok("Risposta inviata");
    }

    @GetMapping("/mie")
    public ResponseEntity<List<Richiesta>> getRichiesteUtente(Authentication authentication) {
        String email = authentication.getName();
        List<Richiesta> richiesteUtente = richiestaService.getRichiesteByEmail(email);
        return ResponseEntity.ok(richiesteUtente);
    }

    // NUOVO: metodo per eliminare richiesta (solo ADMIN)
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteRichiesta(@PathVariable Long id) {
        try {
            Richiesta richiesta = richiestaService.getById(id);
            if (richiesta == null) {
                return ResponseEntity.notFound().build();
            }
            richiestaService.delete(id);
            return ResponseEntity.ok().build();
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }
}





