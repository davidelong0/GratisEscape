package com.example.gratisescape.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record UserLoginDTO(
        @Email @NotBlank String email,
        @NotBlank String password
) {}
