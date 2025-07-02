package com.example.gratisescape.config;

import com.example.gratisescape.models.User;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import jakarta.annotation.PostConstruct;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import javax.crypto.SecretKey;
import java.util.Date;
import java.util.function.Function;

@Service
public class JwtService {

    @Value("${jwt.secret}")
    private String secret;

    @Value("${jwt.expiration}")
    private long expiration;

    private SecretKey signingKey;

    @PostConstruct
    public void init() {
        this.signingKey = Keys.hmacShaKeyFor(secret.getBytes());
    }

    public String generateToken(User user) {
        return Jwts.builder()
                .setSubject(user.getEmail())
                .claim("ruolo", user.getRuolo().name())
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + expiration))
                .signWith(signingKey)
                .compact();
    }

    public String generateEmailConfirmationToken(User user) {
        return Jwts.builder()
                .setSubject(user.getEmail())
                .claim("type", "email_confirmation")
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + 86_400_000)) // 24 ore
                .signWith(signingKey)
                .compact();
    }

    public String generatePasswordResetToken(User user) {
        return Jwts.builder()
                .setSubject(user.getEmail())
                .claim("type", "reset_password")
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + 900_000)) // 15 minuti
                .signWith(signingKey)
                .compact();
    }

    public boolean isEmailConfirmationToken(String token) {
        try {
            String type = extractClaim(token, claims -> claims.get("type", String.class));
            return "email_confirmation".equals(type);
        } catch (Exception e) {
            return false;
        }
    }

    public boolean isPasswordResetToken(String token) {
        try {
            String type = extractClaim(token, claims -> claims.get("type", String.class));
            return "reset_password".equals(type);
        } catch (Exception e) {
            return false;
        }
    }

    public String extractUsername(String token) {
        return extractClaim(token, Claims::getSubject);
    }

    public boolean isTokenValid(String token, User user) {
        final String username = extractUsername(token);
        return username.equals(user.getEmail()) && !isTokenExpired(token);
    }

    private boolean isTokenExpired(String token) {
        return extractClaim(token, Claims::getExpiration).before(new Date());
    }

    public <T> T extractClaim(String token, Function<Claims, T> claimsResolver) {
        final Claims claims = Jwts.parser()
                .setSigningKey(signingKey)
                .parseClaimsJws(token)
                .getBody();
        return claimsResolver.apply(claims);
    }
}








