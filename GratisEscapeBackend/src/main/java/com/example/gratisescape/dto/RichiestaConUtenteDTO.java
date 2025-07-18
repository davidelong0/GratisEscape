package com.example.gratisescape.dto;

import lombok.Data;

@Data
public class RichiestaConUtenteDTO {
    private Long id;
    private String emailUtente;
    private String testoRichiesta;
    private boolean rispostaInviata;
    private String risposta;
    private String nomeUtente;
    private String cognomeUtente;
}

