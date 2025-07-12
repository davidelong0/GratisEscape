package com.example.gratisescape.services;

import com.example.gratisescape.config.JwtService;
import com.example.gratisescape.dto.UserLoginDTO;
import com.example.gratisescape.dto.UserRegisterDTO;
import com.example.gratisescape.dto.ChangePasswordDTO;
import com.example.gratisescape.models.Ruolo;
import com.example.gratisescape.models.User;
import com.example.gratisescape.repositories.UserRepository;
import jakarta.mail.MessagingException;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Map;

@Service
public class AuthService {

    private final UserRepository userRepo;
    private final PasswordEncoder encoder;
    private final JwtService jwtService;
    private final AuthenticationManager authManager;
    private final EmailSenderService emailSender;

    public AuthService(UserRepository userRepo, PasswordEncoder encoder, JwtService jwtService,
                       AuthenticationManager authManager, EmailSenderService emailSender) {
        this.userRepo = userRepo;
        this.encoder = encoder;
        this.jwtService = jwtService;
        this.authManager = authManager;
        this.emailSender = emailSender;
    }

    public ResponseEntity<?> registerUser(UserRegisterDTO dto, String appUrl) {
        if (userRepo.findByEmail(dto.email()).isPresent()) {
            return ResponseEntity.badRequest().body("Email già in uso.");
        }

        User user = User.builder()
                .email(dto.email())
                .password(encoder.encode(dto.password()))
                .nome(dto.nome())
                .cognome(dto.cognome())
                .ruolo(Ruolo.UTENTE)
                .passwordChanged(true)
                .isEnabled(false)
                .build();

        userRepo.save(user);

        String token = jwtService.generateEmailConfirmationToken(user);
        try {
            // 👇 Usa l'URL passato dal controller, deve essere http://localhost:5173
            emailSender.sendConfirmationEmail(user.getEmail(), appUrl, token);
        } catch (MessagingException e) {
            return ResponseEntity.status(500).body("Errore invio email conferma.");
        }

        return ResponseEntity.ok("Registrazione effettuata. Controlla la tua email per confermare l'account.");
    }

    public ResponseEntity<?> confirmEmail(String token) {
        if (!jwtService.isEmailConfirmationToken(token)) {
            return ResponseEntity.badRequest().body(Map.of("message", "Token di conferma email non valido"));
        }

        String email = jwtService.extractUsername(token);
        User user = userRepo.findByEmail(email).orElse(null);
        if (user == null) {
            return ResponseEntity.badRequest().body(Map.of("message", "Utente non trovato"));
        }

        if (user.isEnabled()) {
            return ResponseEntity.ok(Map.of("message", "Account già confermato!"));
        }

        // 🔐 VALIDAZIONE PRIMA DELL’ABILITAZIONE
        if (!jwtService.isTokenValid(token, user)) {
            return ResponseEntity.badRequest().body(Map.of("message", "Token scaduto o non valido"));
        }

        user.setEnabled(true);
        userRepo.save(user);
        return ResponseEntity.ok(Map.of("message", "Email confermata con successo. Puoi ora effettuare il login."));
    }


    public ResponseEntity<?> loginUser(UserLoginDTO dto) {
        try {
            Authentication auth = authManager.authenticate(
                    new UsernamePasswordAuthenticationToken(dto.email(), dto.password())
            );

            UserDetails userDetails = (UserDetails) auth.getPrincipal();

            User user = userRepo.findByEmail(userDetails.getUsername())
                    .orElseThrow(() -> new RuntimeException("Utente non trovato dopo autenticazione"));

            if (!user.isEnabled()) {
                return ResponseEntity.status(403).body("Account non abilitato. Controlla la tua email.");
            }

            if (user.getRuolo() == Ruolo.ADMIN && !user.isPasswordChanged()) {
                return ResponseEntity.status(403).body("Devi cambiare la password al primo accesso.");
            }

            String token = jwtService.generateToken(user);
            return ResponseEntity.ok(Map.of("token", token, "user", user));
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

    public ResponseEntity<?> changePasswordFirst(ChangePasswordDTO dto) {
        User admin = userRepo.findByEmail("admin@gratisescape.com")
                .orElseThrow(() -> new RuntimeException("Admin non trovato"));

        if (admin.isPasswordChanged()) {
            return ResponseEntity.badRequest().body("Password già cambiata, usa il cambio password protetto");
        }

        if (!encoder.matches(dto.oldPassword(), admin.getPassword())) {
            return ResponseEntity.badRequest().body("Vecchia password errata");
        }

        admin.setPassword(encoder.encode(dto.newPassword()));
        admin.setPasswordChanged(true);
        userRepo.save(admin);

        return ResponseEntity.ok("Password admin cambiata con successo");
    }
}










