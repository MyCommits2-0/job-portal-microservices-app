package com.jobportal.service;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;

import java.util.Date;

import javax.crypto.SecretKey;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

@Service
public class JwtUtil {

    @Value("${jwt.secret}")
    private String secretKey;

    public Claims extractClaims(String token) {

        return Jwts.parser()
                .verifyWith(getSigningKey())
                .build()
                .parseSignedClaims(token)
                .getPayload();
    }

    public boolean isTokenValid(String token) {

        try {
            Claims claims = extractClaims(token);

            String email = claims.getSubject();
            Date expiration = claims.getExpiration();

            return email != null && expiration != null && expiration.after(new Date());

        } catch (Exception e) {
            return false;
        }
    }

    public String extractEmail(String token) {
        return extractClaims(token).getSubject();
    }

    public String extractUserId(String token) {
        Object userId = extractClaims(token).get("userId");
        return userId == null ? null : String.valueOf(userId);
    }

    public String extractRole(String token) {
        Object role = extractClaims(token).get("role");
        return role == null ? null : String.valueOf(role);
    }

    private SecretKey getSigningKey() {

        byte[] keyBytes = Decoders.BASE64.decode(secretKey);
        return Keys.hmacShaKeyFor(keyBytes);
    }
}