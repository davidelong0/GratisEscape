package com.example.gratisescape.dto;

import com.example.gratisescape.models.CategoriaViaggio;
import jakarta.validation.constraints.*;

public record ViaggioUpdateDTO(
        @NotBlank String nome,
        @NotBlank String descrizione,
        @NotBlank String destinazione,
        @NotNull CategoriaViaggio categoria,
        @NotNull @Positive Double prezzo,
        String urlImmagine
) {}
