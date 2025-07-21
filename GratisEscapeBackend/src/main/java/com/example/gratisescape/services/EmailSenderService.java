package com.example.gratisescape.services;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

@Service
public class EmailSenderService {

    private final JavaMailSender mailSender;

    public EmailSenderService(JavaMailSender mailSender) {
        this.mailSender = mailSender;
    }

    public void sendConfirmationEmail(String toEmail, String frontendUrl, String token) throws MessagingException {
        String link = frontendUrl + "/conferma-email?token=" + token;

        MimeMessage message = mailSender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(message, true);
        helper.setTo(toEmail);
        helper.setSubject("Conferma la tua email - GratisEscape");
        helper.setText(
                "Ciao,<br>Per favore conferma il tuo account cliccando il link:<br>" +
                        "<a href=\"" + link + "\">Conferma Email</a>", true);

        mailSender.send(message);
    }

}

