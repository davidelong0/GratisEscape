package com.example.gratisescape.config;

import com.example.gratisescape.services.CustomOAuth2UserService;
import com.example.gratisescape.services.CustomUserDetailsService;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
public class SecurityConfig {

    private final JwtAuthFilter jwtAuthFilter;
    private final CustomAuthenticationEntryPoint unauthorizedHandler;
    private final CustomUserDetailsService userDetailsService;
    private final CustomOAuth2UserService oAuth2UserService;
    private final OAuth2SuccessHandler oAuth2SuccessHandler;

    public SecurityConfig(JwtAuthFilter jwtAuthFilter,
                          CustomAuthenticationEntryPoint unauthorizedHandler,
                          CustomUserDetailsService userDetailsService,
                          CustomOAuth2UserService oAuth2UserService,
                          OAuth2SuccessHandler oAuth2SuccessHandler) {
        this.jwtAuthFilter = jwtAuthFilter;
        this.unauthorizedHandler = unauthorizedHandler;
        this.userDetailsService = userDetailsService;
        this.oAuth2UserService = oAuth2UserService;
        this.oAuth2SuccessHandler = oAuth2SuccessHandler;
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        return http
                .cors(Customizer.withDefaults())
                .csrf(csrf -> csrf.disable())
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers(
                                "/auth/register",
                                "/auth/login",
                                "/auth/confirm",
                                "/auth/confirm/**",
                                "/auth/change-password-first",
                                "/auth/forgot-password",
                                "/auth/reset-password",
                                "/public/**",
                                "/oauth2/**",
                                "/login/**"
                        ).permitAll()
                        .requestMatchers(HttpMethod.GET, "/viaggi/**").permitAll()
                        .requestMatchers(HttpMethod.POST, "/viaggi/**").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.PUT, "/viaggi/**").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.DELETE, "/viaggi/**").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.POST, "/richieste").permitAll()
                        .requestMatchers(HttpMethod.GET, "/richieste").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.POST, "/richieste/**/rispondi").hasRole("ADMIN")
                        // Ecco la riga aggiunta per DELETE richieste solo admin:
                        .requestMatchers(HttpMethod.DELETE, "/richieste/**").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.POST, "/chat/**").permitAll()
                        .requestMatchers(HttpMethod.GET, "/chat/**").permitAll()
                        .requestMatchers("/ws-chat/**").permitAll()
                        .anyRequest().authenticated()
                )
                .exceptionHandling(ex -> ex.authenticationEntryPoint(unauthorizedHandler))
                .oauth2Login(oauth2 -> oauth2
                        .userInfoEndpoint(userInfo -> userInfo.userService(oAuth2UserService))
                        .successHandler(oAuth2SuccessHandler)
                )
                .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class)
                .httpBasic(Customizer.withDefaults())
                .build();
    }


    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration config) throws Exception {
        return config.getAuthenticationManager();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
}











