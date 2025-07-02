// DataInitializer.java
package com.example.gratisescape.config;

import com.example.gratisescape.models.Ruolo;
import com.example.gratisescape.models.User;
import com.example.gratisescape.repositories.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

@Configuration
public class DataInitializer implements CommandLineRunner {

    private final UserRepository userRepo;
    private final PasswordEncoder passwordEncoder;

    public DataInitializer(UserRepository userRepo, PasswordEncoder passwordEncoder) {
        this.userRepo = userRepo;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) throws Exception {
        if (userRepo.findByEmail("admin@gratisescape.com").isEmpty()) {
            User admin = User.builder()
                    .email("admin@gratisescape.com")
                    .password(passwordEncoder.encode("Admin123!"))
                    .nome("Admin")
                    .cognome("Default")
                    .ruolo(Ruolo.ADMIN)
                    .passwordChanged(false)
                    .isEnabled(true)
                    .build();
            userRepo.save(admin);
            System.out.println("Admin di default creato: admin@gratisescape.com / Admin123!");
        }
    }
}




