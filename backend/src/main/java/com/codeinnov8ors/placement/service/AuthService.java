package com.codeinnov8ors.placement.service;

import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.context.annotation.Profile;
import org.springframework.transaction.annotation.Transactional;

import com.codeinnov8ors.placement.dto.auth.AuthResponse;
import com.codeinnov8ors.placement.dto.auth.AuthenticatedUser;
import com.codeinnov8ors.placement.dto.auth.LoginRequest;
import com.codeinnov8ors.placement.dto.auth.RegisterRequest;
import com.codeinnov8ors.placement.entity.User;
import com.codeinnov8ors.placement.entity.enums.UserRole;
import com.codeinnov8ors.placement.entity.enums.UserStatus;
import com.codeinnov8ors.placement.repository.UserRepository;
import com.codeinnov8ors.placement.security.JwtService;

@Service
@Profile("!test")
public class AuthService {

	private final UserRepository userRepository;
	private final PasswordEncoder passwordEncoder;
	private final AuthenticationManager authenticationManager;
	private final JwtService jwtService;

	public AuthService(UserRepository userRepository, PasswordEncoder passwordEncoder,
			AuthenticationManager authenticationManager, JwtService jwtService) {
		this.userRepository = userRepository;
		this.passwordEncoder = passwordEncoder;
		this.authenticationManager = authenticationManager;
		this.jwtService = jwtService;
	}

	@Transactional
	public AuthResponse register(RegisterRequest request) {
		String email = request.email().trim().toLowerCase();
		if (userRepository.existsByEmail(email)) {
			throw new IllegalArgumentException("An account with this email already exists");
		}
		User user = new User();
		user.setEmail(email);
		user.setPasswordHash(passwordEncoder.encode(request.password()));
		user.setRole(UserRole.STUDENT);
		user.setStatus(UserStatus.ACTIVE);
		User saved = userRepository.save(user);
		return response(saved);
	}

	@Transactional
	public AuthResponse login(LoginRequest request) {
		String email = request.email().trim().toLowerCase();
		authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(email, request.password()));
		User user = userRepository.findByEmail(email).orElseThrow();
		user.setLastLoginAt(java.time.Instant.now());
		return response(userRepository.save(user));
	}

	public AuthResponse response(User user) {
		return new AuthResponse(jwtService.generateToken(user), jwtService.getExpirationMs(), AuthenticatedUser.from(user));
	}
}
