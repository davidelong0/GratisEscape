package com.example.gratisescape.controllers;

import com.example.gratisescape.dto.RichiestaConUtenteDTO;
import com.example.gratisescape.dto.RispostaDTO;
import com.example.gratisescape.models.Richiesta;
import com.example.gratisescape.models.User;
import com.example.gratisescape.repositories.UserRepository;
import com.example.gratisescape.services.RichiestaService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/richieste")
public class RichiestaController {

    private final RichiestaService richiestaService;
    private final UserRepository userRepo;

    public RichiestaController(RichiestaService richiestaService, UserRepository userRepo) {
        this.richiestaService = richiestaService;
        this.userRepo = userRepo;
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
            richiestaService.deleteRichiestaConMessaggi(id);
            return ResponseEntity.ok().build();
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    // ✅ NUOVO: restituisce anche nome e cognome dell’utente associato alla richiesta
    @GetMapping("/{id}/dettagli")
    public ResponseEntity<RichiestaConUtenteDTO> getRichiestaConUtente(@PathVariable Long id) {
        Richiesta richiesta = richiestaService.getById(id);

        User utente = userRepo.findByEmail(richiesta.getEmailUtente())
                .orElseThrow(() -> new RuntimeException("Utente non trovato per email: " + richiesta.getEmailUtente()));

        RichiestaConUtenteDTO dto = new RichiestaConUtenteDTO();
        dto.setId(richiesta.getId());
        dto.setEmailUtente(richiesta.getEmailUtente());
        dto.setTestoRichiesta(richiesta.getTestoRichiesta());
        dto.setRisposta(richiesta.getRisposta());
        dto.setRispostaInviata(richiesta.isRispostaInviata());
        dto.setNomeUtente(utente.getNome());
        dto.setCognomeUtente(utente.getCognome());

        return ResponseEntity.ok(dto);
    }
}






