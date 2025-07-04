package com.example.gratisescape.services;

import com.example.gratisescape.models.Richiesta;
import com.example.gratisescape.repositories.RichiestaRepository;
import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class RichiestaService {

    private final RichiestaRepository richiestaRepo;
    private final JavaMailSender mailSender;

    public RichiestaService(RichiestaRepository richiestaRepo, JavaMailSender mailSender) {
        this.richiestaRepo = richiestaRepo;
        this.mailSender = mailSender;
    }


    public Richiesta creaRichiesta(Richiesta richiesta) {
        richiesta.setRispostaInviata(false);
        richiesta.setRisposta(null);
        return richiestaRepo.save(richiesta);
    }


    public List<Richiesta> getTutte() {
        return richiestaRepo.findAll();
    }


    public Richiesta getById(Long id) {
        return richiestaRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Richiesta con ID " + id + " non trovata"));
    }


    public void inviaRisposta(Richiesta richiesta, String risposta) {
        try {
            System.out.println("📨 Inizio invio risposta alla mail: " + richiesta.getEmailUtente());

            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true);
            helper.setTo(richiesta.getEmailUtente());
            helper.setSubject("Risposta alla tua richiesta - GratisEscape");
            helper.setText(
                    "Ciao,<br><br>" +
                            "Hai inviato questa richiesta:<br><i>" + richiesta.getTestoRichiesta() + "</i><br><br>" +
                            "Risposta dell'agenzia:<br><b>" + risposta + "</b><br><br>" +
                            "Grazie,<br>GratisEscape", true);

            mailSender.send(message);

            richiesta.setRisposta(risposta);
            richiesta.setRispostaInviata(true);
            richiestaRepo.save(richiesta);

            System.out.println("✅ Risposta inviata con successo");
        } catch (MessagingException e) {
            System.err.println("❌ Errore invio email: " + e.getMessage());
            throw new RuntimeException("Errore durante l'invio dell'email: " + e.getMessage());
        } catch (Exception ex) {
            System.err.println("❌ Altro errore: " + ex.getMessage());
            throw new RuntimeException("Errore interno: " + ex.getMessage());
        }
    }

}



