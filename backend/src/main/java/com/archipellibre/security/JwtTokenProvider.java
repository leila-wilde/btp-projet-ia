package com.archipellibre.security;

import io.jsonwebtoken.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.util.Date;

@Component
public class JwtTokenProvider {

    private static final Logger logger = LoggerFactory.getLogger(JwtTokenProvider.class);

    @Value("${app.jwt.secret}")
    private String jwtSecret;

    @Value("${app.jwt.expiration}")
    private long jwtExpirationMs;

    private byte[] getSigningKey() {
        return jwtSecret.getBytes(StandardCharsets.UTF_8);
    }

    public String generateToken(Authentication authentication) {
        UserDetails userPrincipal = (UserDetails) authentication.getPrincipal();

        Date now = new Date();
        Date expiryDate = new Date(now.getTime() + jwtExpirationMs);

    return Jwts.builder()
        .setSubject(userPrincipal.getUsername())
        .setIssuedAt(now)
        .setExpiration(expiryDate)
        // Legacy JJWT signature method for 0.9.x
        .signWith(SignatureAlgorithm.HS512, getSigningKey())
        .compact();
    }

    public String getUsernameFromJWT(String token) {
    Claims claims = Jwts.parser()
        .setSigningKey(getSigningKey())
        .parseClaimsJws(token)
        .getBody();

        return claims.getSubject();
    }

    public boolean validateToken(String authToken) {
        try {
        Jwts.parser()
            .setSigningKey(getSigningKey())
            .parseClaimsJws(authToken);
            return true;
        } catch (SecurityException ex) {
            logger.error("Invalid JWT signature");
        } catch (MalformedJwtException ex) {
            logger.error("Invalid JWT token");
        } catch (ExpiredJwtException ex) {
            logger.error("Expired JWT token");
        } catch (UnsupportedJwtException ex) {
            logger.error("Unsupported JWT token");
        } catch (IllegalArgumentException ex) {
            logger.error("JWT claims string is empty");
        }
        return false;
    }
}
