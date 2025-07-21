package com.example.gratisescape.dto;

public record ChatMessage(
        Long richiestaId,
        String mittente,
        String messaggio,
        String emailDestinatario
) {}
