package com.example.gratisescape.controllers;

import com.example.gratisescape.dto.UserLoginDTO;
import com.example.gratisescape.dto.UserRegisterDTO;
import com.example.gratisescape.dto.ChangePasswordDTO;
import com.example.gratisescape.models.User;
import com.example.gratisescape.repositories.UserRepository;
import com.example.gratisescape.config.JwtService;
import com.example.gratisescape.services.AuthService;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;

@RestController
@RequestMapping("/auth")
public class AuthController {

    private final AuthService authService;
    private final JwtService jwtService;
    private final UserRepository userRepo;

    public AuthController(AuthService authService, JwtService jwtService, UserRepository userRepo) {
        this.authService = authService;
        this.jwtService = jwtService;
        this.userRepo = userRepo;
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@Valid @RequestBody UserRegisterDTO userDTO,
                                      @RequestHeader("Origin") String origin) {
        return authService.registerUser(userDTO, origin);
    }

    @GetMapping("/confirm")
    public void confirmEmail(@RequestParam String token, HttpServletResponse response) throws IOException {
        System.out.println("🔑 Token ricevuto: " + token);

        if (!jwtService.isEmailConfirmationToken(token)) {
            System.out.println("❌ Token non valido per conferma email");
            response.sendRedirect("http://localhost:3000/errore-conferma");
            return;
        }

        String email = jwtService.extractUsername(token);
        System.out.println("📧 Email estratta: " + email);

        User user = userRepo.findByEmail(email).orElse(null);
        if (user == null) {
            System.out.println("❌ Utente non trovato");
            response.sendRedirect("http://localhost:3000/errore-conferma");
            return;
        }

        if (user.isEnabled()) {
            System.out.println("ℹ️ Utente già confermato");
            response.sendRedirect("http://localhost:3000/login?alreadyConfirmed=true");
            return;
        }

        if (!jwtService.isTokenValid(token, user)) {
            System.out.println("❌ Token non valido");
            response.sendRedirect("http://localhost:3000/errore-conferma");
            return;
        }

        user.setEnabled(true);
        userRepo.save(user);
        System.out.println("✅ Utente abilitato: " + email);

        response.sendRedirect("http://localhost:3000/login?confirmed=true");
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@Valid @RequestBody UserLoginDTO loginDTO) {
        return authService.loginUser(loginDTO);
    }

    @PostMapping("/change-password")
    public ResponseEntity<?> changePassword(@RequestBody ChangePasswordDTO dto, Authentication authentication) {
        String authenticatedEmail = authentication.getName();
        return authService.changePassword(authenticatedEmail, dto.oldPassword(), dto.newPassword());
    }

    @PostMapping("/change-password-first")
    public ResponseEntity<?> changePasswordFirst(@RequestBody ChangePasswordDTO dto) {
        return authService.changePasswordFirst(dto);
    }
}









