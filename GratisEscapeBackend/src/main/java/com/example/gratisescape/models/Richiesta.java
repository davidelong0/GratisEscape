package com.example.gratisescape.models;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Richiesta {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String emailUtente;

    private String testoRichiesta;

    private boolean rispostaInviata;

    private String risposta;


    @Builder.Default
    private boolean vistaDaAdmin = false;

    @Column(updatable = false)
    private LocalDateTime dataCreazione;

}



