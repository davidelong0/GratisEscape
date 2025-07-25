package com.example.gratisescape.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record UserRegisterDTO(
        @Email @NotBlank String email,
        @NotBlank @Size(min = 6) String password,
        @NotBlank String nome,
        @NotBlank String cognome
) {}