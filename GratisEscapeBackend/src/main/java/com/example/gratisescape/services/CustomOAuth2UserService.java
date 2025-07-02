package com.example.gratisescape.services;

import com.example.gratisescape.models.Ruolo;
import com.example.gratisescape.models.User;
import com.example.gratisescape.repositories.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Lazy;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.oauth2.client.userinfo.DefaultOAuth2UserService;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserRequest;
import org.springframework.security.oauth2.core.OAuth2AuthenticationException;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Service;

@Service
public class CustomOAuth2UserService extends DefaultOAuth2UserService {

    private final UserRepository userRepo;

    @Lazy
    @Autowired
    private PasswordEncoder passwordEncoder;

    public CustomOAuth2UserService(UserRepository userRepo) {
        this.userRepo = userRepo;
    }

    @Override
    public OAuth2User loadUser(OAuth2UserRequest userRequest) throws OAuth2AuthenticationException {
        OAuth2User oauth2User = super.loadUser(userRequest);

        String email = oauth2User.getAttribute("email");
        if (email == null) {
            throw new OAuth2AuthenticationException("Email non fornita da Google");
        }

        User user = userRepo.findByEmail(email).orElse(null);
        if (user == null) {
            user = User.builder()
                    .email(email)
                    .nome(oauth2User.getAttribute("given_name"))
                    .cognome(oauth2User.getAttribute("family_name"))
                    .password(passwordEncoder.encode("oauth2user-" + System.currentTimeMillis()))
                    .ruolo(Ruolo.UTENTE)
                    .passwordChanged(true)
                    .build();
            userRepo.save(user);
        }

        return oauth2User;
    }
}




