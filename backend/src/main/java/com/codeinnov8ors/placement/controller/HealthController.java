package com.codeinnov8ors.placement.controller;

import java.time.Instant;
import java.util.Map;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * Minimal liveness endpoint for local development and deployment probes.
 * Database readiness is intentionally reported separately once a live
 * PostgreSQL-backed readiness check is introduced.
 */
@RestController
@RequestMapping("/api/health")
public class HealthController {

	@GetMapping
	public Map<String, Object> health() {
		return Map.of(
				"status", "UP",
				"service", "placement",
				"timestamp", Instant.now().toString());
	}
}
