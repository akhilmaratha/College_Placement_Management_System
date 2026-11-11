package com.codeinnov8ors.placement.dto.auth;

import com.codeinnov8ors.placement.entity.User;

public record AuthenticatedUser(Long id, String name, String email, String role) {
	public static AuthenticatedUser from(User user) {
		String name = user.getEmail().substring(0, user.getEmail().indexOf('@'));
		return new AuthenticatedUser(user.getId(), name, user.getEmail(), user.getRole().name());
	}
}
