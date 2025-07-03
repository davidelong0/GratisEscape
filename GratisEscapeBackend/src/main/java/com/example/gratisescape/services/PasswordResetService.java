package com.example.gratisescape.services;

import com.example.gratisescape.models.User;
import com.example.gratisescape.repositories.UserRepository;
import com.example.gratisescape.config.JwtService;
import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class PasswordResetService {

    private final UserRepository userRepo;
    private final JwtService jwtService;
    private final JavaMailSender mailSender;
    private final PasswordEncoder passwordEncoder;

    public PasswordResetService(UserRepository userRepo, JwtService jwtService,
                                JavaMailSender mailSender, PasswordEncoder passwordEncoder) {
        this.userRepo = userRepo;
        this.jwtService = jwtService;
        this.mailSender = mailSender;
        this.passwordEncoder = passwordEncoder;
    }

    public void sendResetEmail(String email, String appUrl) throws MessagingException {
        Optional<User> userOpt = userRepo.findByEmail(email);
        if (userOpt.isEmpty()) return;

        User user = userOpt.get();

        String token = jwtService.generatePasswordResetToken(user);
        String resetUrl = appUrl + "/reset-password?token=" + token;

        // ✅ Stampa utile in fase di sviluppo per recuperare il token
        System.out.println("🔑 Token reset password: " + token);
        System.out.println("📩 Link reset password: " + resetUrl);

        MimeMessage message = mailSender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(message, true);
        helper.setTo(user.getEmail());
        helper.setSubject("Reset password GratisEscape");
        helper.setText(
                "Ciao " + user.getNome() + ",<br>" +
                        "Per favore clicca il link per resettare la tua password:<br>" +
                        "<a href=\"" + resetUrl + "\">Reset Password</a>", true
        );

        mailSender.send(message);
    }

    public boolean resetPassword(String token, String newPassword) {
        String email = jwtService.extractUsername(token);

        if (email == null || !jwtService.isPasswordResetToken(token)) return false;

        User user = userRepo.findByEmail(email).orElse(null);
        if (user == null) return false;

        if (!jwtService.isTokenValid(token, user)) return false;

        user.setPassword(passwordEncoder.encode(newPassword));
        user.setPasswordChanged(true);
        userRepo.save(user);
        return true;
    }
}





