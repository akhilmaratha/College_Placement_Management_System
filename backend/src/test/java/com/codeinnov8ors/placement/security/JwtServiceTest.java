package com.codeinnov8ors.placement.security;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;

import org.junit.jupiter.api.Test;

import com.codeinnov8ors.placement.config.JwtProperties;
import com.codeinnov8ors.placement.entity.User;
import com.codeinnov8ors.placement.entity.enums.UserRole;

class JwtServiceTest {

	@Test
	void generatesAndParsesSignedToken() {
		JwtProperties properties = new JwtProperties();
		properties.setSecret("test-secret-that-is-at-least-32-characters-long");
		properties.setExpirationMs(60_000);
		JwtService service = new JwtService(properties);

		User user = new User();
		user.setId(42L);
		user.setEmail("student@example.com");
		user.setRole(UserRole.STUDENT);

		String token = service.generateToken(user);
		assertEquals("student@example.com", service.parse(token).get("email", String.class));
		assertEquals("STUDENT", service.parse(token).get("role", String.class));
	}

	@Test
	void rejectsShortSecret() {
		JwtProperties properties = new JwtProperties();
		properties.setSecret("short");
		assertThrows(IllegalStateException.class, () -> new JwtService(properties));
	}
}
