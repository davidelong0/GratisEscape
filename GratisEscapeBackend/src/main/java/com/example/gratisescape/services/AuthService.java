package com.example.gratisescape.services;

import com.example.gratisescape.config.JwtService;
import com.example.gratisescape.dto.UserLoginDTO;
import com.example.gratisescape.dto.UserRegisterDTO;
import com.example.gratisescape.models.Ruolo;
import com.example.gratisescape.models.User;
import com.example.gratisescape.repositories.UserRepository;
import com.example.gratisescape.dto.ChangePasswordDTO;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthService {

    private final UserRepository userRepo;
    private final PasswordEncoder encoder;
    private final JwtService jwtService;
    private final AuthenticationManager authManager;

    public AuthService(UserRepository userRepo, PasswordEncoder encoder, JwtService jwtService, AuthenticationManager authManager) {
        this.userRepo = userRepo;
        this.encoder = encoder;
        this.jwtService = jwtService;
        this.authManager = authManager;
    }

    public ResponseEntity<?> registerUser(UserRegisterDTO dto) {
        if (userRepo.findByEmail(dto.email()).isPresent()) {
            return ResponseEntity.badRequest().body("Email già in uso.");
        }

        User user = User.builder()
                .email(dto.email())
                .password(encoder.encode(dto.password()))
                .nome(dto.nome())
                .cognome(dto.cognome())
                .ruolo(Ruolo.UTENTE)
                .passwordChanged(true) // utenti normali registrati hanno subito password valida
                .build();

        userRepo.save(user);
        String token = jwtService.generateToken(user);
        return ResponseEntity.ok(token);
    }

    public ResponseEntity<?> loginUser(UserLoginDTO dto) {
        try {
            Authentication auth = authManager.authenticate(
                    new UsernamePasswordAuthenticationToken(dto.email(), dto.password())
            );

            UserDetails userDetails = (UserDetails) auth.getPrincipal();

            User user = userRepo.findByEmail(userDetails.getUsername())
                    .orElseThrow(() -> new RuntimeException("Utente non trovato dopo autenticazione"));

            // Controllo: se admin e non ha cambiato password, blocco login
            if (user.getRuolo() == Ruolo.ADMIN && !user.isPasswordChanged()) {
                return ResponseEntity.status(403).body("Devi cambiare la password al primo accesso.");
            }

            String token = jwtService.generateToken(user);
            return ResponseEntity.ok(token);
        } catch (Exception e) {
            return ResponseEntity.status(401).body("Credenziali non valide");
        }
    }

    public ResponseEntity<?> changePassword(String email, String oldPassword, String newPassword) {
        User user = userRepo.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Utente non trovato"));

        if (!encoder.matches(oldPassword, user.getPassword())) {
            return ResponseEntity.badRequest().body("Vecchia password errata");
        }

        user.setPassword(encoder.encode(newPassword));
        user.setPasswordChanged(true);
        userRepo.save(user);

        return ResponseEntity.ok("Password cambiata con successo");
    }
}








