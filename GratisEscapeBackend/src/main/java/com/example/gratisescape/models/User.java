package com.example.gratisescape.models;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "users")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, nullable = false)
    private String email;

    @Column(nullable = false)
    private String password;

    @Column(nullable = false)
    private String nome;

    @Column(nullable = false)
    private String cognome;

    @Enumerated(EnumType.STRING)
    private Ruolo ruolo;

    @Column(nullable = false)
    private boolean isEnabled; // ⚠️ Nessun valore predefinito. Viene gestito dal codice.

    private boolean passwordChanged = false;
}




