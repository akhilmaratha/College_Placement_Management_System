package com.codeinnov8ors.placement.security;

import java.io.IOException;

import org.springframework.http.HttpHeaders;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.context.annotation.Profile;
import org.springframework.web.filter.OncePerRequestFilter;

import com.codeinnov8ors.placement.config.JwtProperties;

import io.jsonwebtoken.Claims;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

@Component
@Profile("!test")
public class JwtAuthenticationFilter extends OncePerRequestFilter {

	private final JwtService jwtService;
	private final UserDetailsServiceImpl userDetailsService;
	private final JwtProperties properties;

	public JwtAuthenticationFilter(JwtService jwtService, UserDetailsServiceImpl userDetailsService,
			JwtProperties properties) {
		this.jwtService = jwtService;
		this.userDetailsService = userDetailsService;
		this.properties = properties;
	}

	@Override
	protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
			throws ServletException, IOException {
		String token = resolveToken(request);
		if (token != null && SecurityContextHolder.getContext().getAuthentication() == null) {
			try {
				Claims claims = jwtService.parse(token);
				String email = claims.get("email", String.class);
				if (email != null) {
					UserDetails userDetails = userDetailsService.loadUserByUsername(email);
					var authentication = new UsernamePasswordAuthenticationToken(userDetails, null,
							userDetails.getAuthorities());
					authentication.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
					SecurityContextHolder.getContext().setAuthentication(authentication);
				}
			} catch (RuntimeException ignored) {
				// Leave the request unauthenticated; Security will return 401/403 as appropriate.
			}
		}
		filterChain.doFilter(request, response);
	}

	private String resolveToken(HttpServletRequest request) {
		String header = request.getHeader(HttpHeaders.AUTHORIZATION);
		if (header != null && header.startsWith("Bearer ")) {
			return header.substring(7);
		}
		if (request.getCookies() != null) {
			for (Cookie cookie : request.getCookies()) {
				if (properties.getCookieName().equals(cookie.getName())) {
					return cookie.getValue();
				}
			}
		}
		return null;
	}
}
