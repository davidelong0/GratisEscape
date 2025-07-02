package com.example.gratisescape.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

public record PasswordResetRequestDTO(
        @Email @NotBlank
        String email
) {}


