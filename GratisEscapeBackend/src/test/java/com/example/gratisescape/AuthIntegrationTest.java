package com.example.gratisescape;

import com.example.gratisescape.dto.ChangePasswordDTO;
import com.example.gratisescape.dto.PasswordResetDTO;
import com.example.gratisescape.dto.PasswordResetRequestDTO;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
public class AuthIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Test
    public void testLogin() throws Exception {
        String loginJson = """
            {
                "email": "admin@gratisescape.com",
                "password": "Admin123!"
            }
        """;

        mockMvc.perform(post("/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(loginJson))
                .andExpect(status().isOk())
                .andExpect(content().string(org.hamcrest.Matchers.notNullValue()));
    }

    @Test
    public void testForgotPasswordAndReset() throws Exception {
        PasswordResetRequestDTO requestDTO = new PasswordResetRequestDTO("admin@gratisescape.com");
        mockMvc.perform(post("/auth/forgot-password")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(requestDTO))
                        .header("Origin", "http://localhost:3000"))
                .andExpect(status().isOk());


        PasswordResetDTO resetDTO = new PasswordResetDTO("dummy-token", "NuovaPass123!");
        mockMvc.perform(post("/auth/reset-password")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(resetDTO)))
                .andExpect(status().isBadRequest());
    }
}
