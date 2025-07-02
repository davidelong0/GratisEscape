package com.example.gratisescape.dto;

import jakarta.validation.constraints.NotBlank;

public record PasswordResetDTO(
        @NotBlank
        String token,
        @NotBlank
        String newPassword
) {}


