package com.codeinnov8ors.placement.controller;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.codeinnov8ors.placement.dto.company.CompanyRequest;
import com.codeinnov8ors.placement.dto.company.CompanyResponse;
import com.codeinnov8ors.placement.dto.company.CompanyStatusRequest;
import com.codeinnov8ors.placement.service.CompanyService;

import jakarta.validation.Valid;

@RestController
@org.springframework.context.annotation.Profile("!test")
@Validated
@RequestMapping("/api/companies")
public class CompanyController {
	private final CompanyService service;
	public CompanyController(CompanyService service) { this.service = service; }

	@GetMapping public ResponseEntity<Page<CompanyResponse>> list(@RequestParam(required = false) String q,
		@RequestParam(defaultValue = "0") int page, @RequestParam(defaultValue = "20") int size, Authentication auth) {
		if (page < 0 || size < 1 || size > 100) return ResponseEntity.badRequest().build();
		return ResponseEntity.ok(service.list(q, PageRequest.of(page, size, Sort.by("name").ascending()), auth));
	}
	@GetMapping("/{id}") public CompanyResponse get(@PathVariable Long id, Authentication auth) { return service.get(id, auth); }
	@PostMapping public ResponseEntity<CompanyResponse> create(@Valid @RequestBody CompanyRequest request, Authentication auth) {
		return ResponseEntity.status(HttpStatus.CREATED).body(service.create(request, auth));
	}
	@PutMapping("/{id}") public CompanyResponse update(@PathVariable Long id, @Valid @RequestBody CompanyRequest request, Authentication auth) {
		return service.update(id, request, auth);
	}
	@PatchMapping("/{id}/status") public CompanyResponse updateStatus(@PathVariable Long id, @Valid @RequestBody CompanyStatusRequest request, Authentication auth) {
		return service.setStatus(id, request.verificationStatus(), auth);
	}
}
