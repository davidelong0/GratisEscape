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
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;
import org.springframework.stereotype.Component;
import org.springframework.web.util.UriComponentsBuilder;

import java.io.IOException;
import java.util.UUID;

@Component
public class OAuth2SuccessHandler implements AuthenticationSuccessHandler {

    private final JwtService jwtService;
    private final UserRepository userRepository;

    public OAuth2SuccessHandler(JwtService jwtService, UserRepository userRepository) {
        this.jwtService = jwtService;
        this.userRepository = userRepository;
    }

    @Override
    public void onAuthenticationSuccess(HttpServletRequest request,
                                        HttpServletResponse response,
                                        Authentication authentication) throws IOException, ServletException {

        OAuth2User oAuth2User = (OAuth2User) authentication.getPrincipal();
        String email = oAuth2User.getAttribute("email");
        String nome = oAuth2User.getAttribute("given_name");
        String cognome = oAuth2User.getAttribute("family_name");

        User user = userRepository.findByEmail(email).orElseGet(() -> {
            User nuovo = new User();
            nuovo.setEmail(email);
            nuovo.setNome(nome != null ? nome : "Google");
            nuovo.setCognome(cognome != null ? cognome : "User");
            nuovo.setRuolo(Ruolo.UTENTE);
            nuovo.setEnabled(true);
            nuovo.setPasswordChanged(true);
            PasswordEncoder encoder = new BCryptPasswordEncoder();
            nuovo.setPassword(encoder.encode(UUID.randomUUID().toString())); // password fittizia
            return userRepository.save(nuovo);
        });

        String jwt = jwtService.generateToken(user);

        String redirectUrl = UriComponentsBuilder
                .fromUriString("http://localhost:5173/oauth-success")
                .queryParam("token", jwt)
                .queryParam("nome", user.getNome())
                .queryParam("cognome", user.getCognome())
                .queryParam("email", user.getEmail())
                .queryParam("ruolo", user.getRuolo().name())
                .build().toUriString();

        response.sendRedirect(redirectUrl);
    }
}
