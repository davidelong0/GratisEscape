package com.example.gratisescape.controllers;

import com.example.gratisescape.config.JwtService;
import com.example.gratisescape.models.User;
import com.example.gratisescape.repositories.UserRepository;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.io.IOException;

@RestController
public class OAuth2Controller {

    private final JwtService jwtService;
    private final UserRepository userRepo;

    public OAuth2Controller(JwtService jwtService, UserRepository userRepo) {
        this.jwtService = jwtService;
        this.userRepo = userRepo;
    }

    @GetMapping("/oauth2/success")
    public void oauth2Success(Authentication authentication, HttpServletResponse response) throws IOException {

        String email = authentication.getName();

        User user = userRepo.findByEmail(email).orElse(null);
        if (user == null) {
            response.sendRedirect("http://localhost:5173/login?oauthError=Utente non trovato");
            return;
        }


        String token = jwtService.generateToken(user);


        response.sendRedirect("http://localhost:5173/oauth-success?token=" + token);
    }
}
