package com.example.gratisescape.models;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Viaggio {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String nome;

    private String descrizione;

    private String destinazione;

    @Enumerated(EnumType.STRING)
    private CategoriaViaggio categoria;

    private Double prezzo;

    private String urlImmagine;
}



