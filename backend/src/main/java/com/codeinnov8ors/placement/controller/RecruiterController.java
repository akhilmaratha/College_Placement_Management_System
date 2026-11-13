package com.codeinnov8ors.placement.controller;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.codeinnov8ors.placement.dto.recruiter.RecruiterProfileUpdateRequest;
import com.codeinnov8ors.placement.dto.recruiter.RecruiterCompanyAssignmentRequest;
import com.codeinnov8ors.placement.dto.recruiter.RecruiterResponse;
import com.codeinnov8ors.placement.service.RecruiterService;

import jakarta.validation.Valid;

@RestController
@org.springframework.context.annotation.Profile("!test")
@Validated
@RequestMapping("/api/recruiters")
public class RecruiterController {
	private final RecruiterService service;
	public RecruiterController(RecruiterService service) { this.service = service; }
	@GetMapping("/me") public RecruiterResponse me(Authentication auth) { return service.me(auth); }
	@PutMapping("/me") public RecruiterResponse updateMe(Authentication auth, @Valid @RequestBody RecruiterProfileUpdateRequest request) { return service.updateMe(auth, request); }
	@GetMapping public ResponseEntity<Page<RecruiterResponse>> list(@RequestParam(required = false) String q,
		@RequestParam(defaultValue = "0") int page, @RequestParam(defaultValue = "20") int size, Authentication auth) {
		if (page < 0 || size < 1 || size > 100) return ResponseEntity.badRequest().build();
		return ResponseEntity.ok(service.list(q, PageRequest.of(page, size, Sort.by("id").ascending()), auth));
	}
	@GetMapping("/{id}") public RecruiterResponse get(@PathVariable Long id, Authentication auth) { return service.get(id, auth); }
	@org.springframework.web.bind.annotation.PatchMapping("/{id}/company")
	public RecruiterResponse assignCompany(@PathVariable Long id, @Valid @RequestBody RecruiterCompanyAssignmentRequest request, Authentication auth) {
		return service.assignCompany(id, request, auth);
	}
}
