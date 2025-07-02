package com.example.gratisescape.controllers;

import com.example.gratisescape.dto.UserLoginDTO;
import com.example.gratisescape.dto.UserRegisterDTO;
import com.example.gratisescape.dto.ChangePasswordDTO;
import com.example.gratisescape.services.AuthService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/auth")
public class AuthController {

    private final AuthService authService;
    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@Valid @RequestBody UserRegisterDTO userDTO) {
        return authService.registerUser(userDTO);
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@Valid @RequestBody UserLoginDTO loginDTO) {
        return authService.loginUser(loginDTO);
    }

    @PostMapping("/change-password")
    public ResponseEntity<?> changePassword(@RequestBody ChangePasswordDTO dto, Authentication authentication) {
        String authenticatedEmail = authentication.getName();
        return authService.changePassword(authenticatedEmail, dto.oldPassword(), dto.newPassword());
    }
}




