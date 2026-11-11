package com.codeinnov8ors.placement.security;

import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertTrue;

import org.junit.jupiter.api.Test;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

class PasswordEncoderTest {

	@Test
	void storesPasswordsAsBcryptHashes() {
		BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();
		String hash = encoder.encode("correct horse battery staple");

		assertTrue(hash.startsWith("$2"));
		assertTrue(encoder.matches("correct horse battery staple", hash));
		assertFalse(encoder.matches("wrong password", hash));
	}
}
