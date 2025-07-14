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
    public ResponseEntity<Richiesta> creaRichiesta(@RequestBody Richiesta richiesta) {
        return ResponseEntity.ok(richiestaService.creaRichiesta(richiesta));
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

    // ✅ NUOVO METODO PER RECUPERARE LE RICHIESTE DELL'UTENTE LOGGATO
    @GetMapping("/mie")
    public ResponseEntity<List<Richiesta>> getRichiesteUtente(Authentication authentication) {
        String email = authentication.getName();
        List<Richiesta> richiesteUtente = richiestaService.getRichiesteByEmail(email);
        return ResponseEntity.ok(richiesteUtente);
    }
}




