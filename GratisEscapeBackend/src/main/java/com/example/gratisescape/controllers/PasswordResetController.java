package com.example.gratisescape.controllers;

import com.example.gratisescape.dto.PasswordResetDTO;
import com.example.gratisescape.dto.PasswordResetRequestDTO;
import com.example.gratisescape.services.PasswordResetService;
import jakarta.mail.MessagingException;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/auth")
public class PasswordResetController {

    private final PasswordResetService passwordResetService;

    public PasswordResetController(PasswordResetService passwordResetService) {
        this.passwordResetService = passwordResetService;
    }

    @PostMapping("/forgot-password")
    public ResponseEntity<?> forgotPassword(@Valid @RequestBody PasswordResetRequestDTO dto,
                                            @RequestHeader("Origin") String origin) {
        try {
            passwordResetService.sendResetEmail(dto.email(), origin);
            return ResponseEntity.ok("Email inviata se esiste un account associato.");
        } catch (MessagingException e) {
            return ResponseEntity.status(500).body("Errore invio email.");
        }
    }

    @PostMapping("/reset-password")
    public ResponseEntity<?> resetPassword(@Valid @RequestBody PasswordResetDTO dto) {
        boolean success = passwordResetService.resetPassword(dto.token(), dto.newPassword());
        if (success) {
            return ResponseEntity.ok("Password aggiornata con successo");
        }
        return ResponseEntity.badRequest().body("Token non valido o scaduto");
    }
}



