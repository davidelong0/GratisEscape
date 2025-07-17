package com.example.gratisescape.services;

import com.example.gratisescape.models.Richiesta;
import com.example.gratisescape.repositories.MessaggioChatRepository;
import com.example.gratisescape.repositories.RichiestaRepository;
import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import jakarta.transaction.Transactional;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class RichiestaService {

    private final RichiestaRepository richiestaRepo;
    private final MessaggioChatRepository messaggioChatRepo;
    private final JavaMailSender mailSender;

    public RichiestaService(RichiestaRepository richiestaRepo,
                            MessaggioChatRepository messaggioChatRepo,
                            JavaMailSender mailSender) {
        this.richiestaRepo = richiestaRepo;
        this.messaggioChatRepo = messaggioChatRepo;
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
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true);
            helper.setTo(richiesta.getEmailUtente());

            helper.setSubject("Risposta alla tua richiesta - GratisEscape");
            helper.setText(
                    "Ciao,<br><br>" +
                            "Hai inviato questa richiesta:<br><i>" + richiesta.getTestoRichiesta() + "</i><br><br>" +
                            "Risposta dell'agenzia:<br><b>" + risposta + "</b><br><br>" +
                            "Grazie,<br>GratisEscape", true
            );
            mailSender.send(message);

            richiesta.setRisposta(risposta);
            richiesta.setRispostaInviata(true);
            richiestaRepo.save(richiesta);
        } catch (MessagingException e) {
            throw new RuntimeException("Errore invio email: " + e.getMessage());
        }
    }

    public List<Richiesta> getRichiesteByEmail(String emailUtente) {
        return richiestaRepo.findByEmailUtente(emailUtente);
    }

    // Metodo aggiornato: elimina prima i messaggi, poi la richiesta
    @Transactional
    public void deleteRichiestaConMessaggi(Long id) {
        // Verifica esistenza richiesta
        if (!richiestaRepo.existsById(id)) {
            throw new RuntimeException("Richiesta non trovata");
        }

        // Elimina i messaggi collegati
        messaggioChatRepo.deleteByRichiestaId(id);

        // Elimina la richiesta
        richiestaRepo.deleteById(id);
    }
}







