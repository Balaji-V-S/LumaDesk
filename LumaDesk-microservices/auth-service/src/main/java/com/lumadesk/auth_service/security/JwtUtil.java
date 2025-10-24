package com.lumadesk.auth_service.security;

import io.jsonwebtoken.*;
import org.springframework.stereotype.Component;
import javax.crypto.spec.SecretKeySpec;
import java.security.Key;
import java.util.*;

@Component
public class JwtUtil {

    private final String jwtSecret = "careerportal_secret_key_which_is_long_enough_12387614876192834769817364987162389476238974689237658976293846";
    private final int jwtExpirationMs = 36000000;

    private Key getSigningKey() {
        byte[] keyBytes = jwtSecret.getBytes();
        return new SecretKeySpec(keyBytes, SignatureAlgorithm.HS512.getJcaName());
    }

    public String generateToken(String username, String role, int i) {
        Map<String, Object> claims = new HashMap<>();
        claims.put("role", role);
        claims.put("userId", i);

        return Jwts.builder()
                .setClaims(claims)
                .setSubject(username)
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + jwtExpirationMs))
                .signWith(getSigningKey(), SignatureAlgorithm.HS512)
                .compact();
    }

    public String getUsernameFromToken(String token) {
        return parseClaims(token).getSubject();
    }

    public String getUserRoleFromToken(String token) {
        return parseClaims(token).get("role", String.class);
    }

    public Long getUserIdFromToken(String token) {
        return parseClaims(token).get("userId", Long.class);
    }

    public boolean validateToken(String token) {
        try {
            parseClaims(token);
            return true;
        } catch (JwtException | IllegalArgumentException e) {
            return false;
        }
    }

    private Claims parseClaims(String token) {
        return Jwts.parser() // The new parser instance
                .verifyWith((javax.crypto.SecretKey) getSigningKey()) // Verify using the secret key
                .build()
                .parseSignedClaims(token)
                .getPayload();
    }
}
