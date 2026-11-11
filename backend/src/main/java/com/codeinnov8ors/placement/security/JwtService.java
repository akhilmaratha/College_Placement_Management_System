package com.codeinnov8ors.placement.security;

import java.nio.charset.StandardCharsets;
import java.util.Date;

import javax.crypto.SecretKey;

import org.springframework.stereotype.Service;
import org.springframework.context.annotation.Profile;

import com.codeinnov8ors.placement.config.JwtProperties;
import com.codeinnov8ors.placement.entity.User;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jws;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;

@Service
@Profile("!test")
public class JwtService {

	private final JwtProperties properties;
	private final SecretKey signingKey;

	public JwtService(JwtProperties properties) {
		if (properties.getSecret() == null || properties.getSecret().length() < 32) {
			throw new IllegalStateException("JWT_SECRET must be at least 32 characters long");
		}
		this.properties = properties;
		this.signingKey = Keys.hmacShaKeyFor(properties.getSecret().getBytes(StandardCharsets.UTF_8));
	}

	public String generateToken(User user) {
		Date now = new Date();
		Date expiry = new Date(now.getTime() + properties.getExpirationMs());
		return Jwts.builder()
				.subject(String.valueOf(user.getId()))
				.claim("email", user.getEmail())
				.claim("role", user.getRole().name())
				.issuedAt(now)
				.expiration(expiry)
				.signWith(signingKey)
				.compact();
	}

	public Claims parse(String token) {
		Jws<Claims> parsed = Jwts.parser().verifyWith(signingKey).build().parseSignedClaims(token);
		return parsed.getPayload();
	}

	public long getExpirationMs() {
		return properties.getExpirationMs();
	}
}
