package com.codeinnov8ors.placement.security;

import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.context.annotation.Profile;

import com.codeinnov8ors.placement.entity.User;
import com.codeinnov8ors.placement.repository.UserRepository;

@Service
@Profile("!test")
public class UserDetailsServiceImpl implements UserDetailsService {

	private final UserRepository userRepository;

	public UserDetailsServiceImpl(UserRepository userRepository) {
		this.userRepository = userRepository;
	}

	@Override
	public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
		User user = userRepository.findByEmail(username.toLowerCase())
				.orElseThrow(() -> new UsernameNotFoundException("Invalid credentials"));
		return org.springframework.security.core.userdetails.User.withUsername(user.getEmail())
				.password(user.getPasswordHash())
				.roles(user.getRole().name())
				.disabled(user.getStatus() != com.codeinnov8ors.placement.entity.enums.UserStatus.ACTIVE)
				.build();
	}
}
