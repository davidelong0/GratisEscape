package com.example.gratisescape.config;

import com.example.gratisescape.models.Ruolo;
import com.example.gratisescape.models.User;
import com.example.gratisescape.repositories.UserRepository;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;
import org.springframework.stereotype.Component;

import java.io.IOException;

@Component
public class OAuth2SuccessHandler implements AuthenticationSuccessHandler {

    private final JwtService jwtService;
    private final UserRepository userRepository;

    public OAuth2SuccessHandler(JwtService jwtService, UserRepository userRepository) {
        this.jwtService = jwtService;
        this.userRepository = userRepository;
    }

    @Override
    public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response,
                                        Authentication authentication) throws IOException, ServletException {

        String email = authentication.getName();

        User user = userRepository.findByEmail(email).orElseGet(() -> {
            User nuovo = new User();
            nuovo.setEmail(email);
            nuovo.setNome("Google");
            nuovo.setCognome("User");
            nuovo.setRuolo(Ruolo.UTENTE);
            nuovo.setEnabled(true);

            // ✅ encoder creato localmente per evitare cicli di dipendenza
            PasswordEncoder encoder = new BCryptPasswordEncoder();
            nuovo.setPassword(encoder.encode("oauth2user"));

            return userRepository.save(nuovo);
        });

        String jwt = jwtService.generateToken(user);
        response.sendRedirect("http://localhost:5173/oauth-success?token=" + jwt);
    }
}
