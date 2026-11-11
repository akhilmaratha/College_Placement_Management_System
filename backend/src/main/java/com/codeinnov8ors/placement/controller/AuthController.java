package com.codeinnov8ors.placement.controller;

import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.context.annotation.Profile;

import com.codeinnov8ors.placement.config.JwtProperties;
import com.codeinnov8ors.placement.dto.auth.AuthResponse;
import com.codeinnov8ors.placement.dto.auth.AuthenticatedUser;
import com.codeinnov8ors.placement.dto.auth.LoginRequest;
import com.codeinnov8ors.placement.dto.auth.RegisterRequest;
import com.codeinnov8ors.placement.repository.UserRepository;
import com.codeinnov8ors.placement.service.AuthService;

import jakarta.validation.Valid;

@RestController
@Profile("!test")
@RequestMapping("/api/auth")
@Validated
public class AuthController {

	private final AuthService authService;
	private final UserRepository userRepository;
	private final JwtProperties jwtProperties;

	public AuthController(AuthService authService, UserRepository userRepository, JwtProperties jwtProperties) {
		this.authService = authService;
		this.userRepository = userRepository;
		this.jwtProperties = jwtProperties;
	}

	@PostMapping("/register")
	public ResponseEntity<AuthResponse> register(@Valid @RequestBody RegisterRequest request) {
		return withCookie(authService.register(request));
	}

	@PostMapping("/login")
	public ResponseEntity<AuthResponse> login(@Valid @RequestBody LoginRequest request) {
		return withCookie(authService.login(request));
	}

	@GetMapping("/me")
	public AuthenticatedUser me(Authentication authentication) {
		return userRepository.findByEmail(authentication.getName())
				.map(AuthenticatedUser::from)
				.orElseThrow(() -> new UsernameNotFoundException("Authenticated user no longer exists"));
	}

	@PostMapping("/logout")
	public ResponseEntity<Void> logout() {
		ResponseCookie cookie = ResponseCookie.from(jwtProperties.getCookieName(), "")
				.httpOnly(true).secure(jwtProperties.isSecureCookie()).sameSite("Lax").path("/").maxAge(0).build();
		return ResponseEntity.noContent().header(HttpHeaders.SET_COOKIE, cookie.toString()).build();
	}

	private ResponseEntity<AuthResponse> withCookie(AuthResponse response) {
		ResponseCookie cookie = ResponseCookie.from(jwtProperties.getCookieName(), response.token())
				.httpOnly(true).secure(jwtProperties.isSecureCookie()).sameSite("Lax").path("/")
				.maxAge(response.expiresIn() / 1000).build();
		return ResponseEntity.ok().header(HttpHeaders.SET_COOKIE, cookie.toString()).body(response);
	}
}
