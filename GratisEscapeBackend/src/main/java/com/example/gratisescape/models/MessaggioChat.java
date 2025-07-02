package com.example.gratisescape.models;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class MessaggioChat {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    private Richiesta richiesta;

    private String mittente; // "USER" o "ADMIN"

    @Column(columnDefinition = "TEXT")
    private String messaggio;

    private LocalDateTime timestamp;
}


