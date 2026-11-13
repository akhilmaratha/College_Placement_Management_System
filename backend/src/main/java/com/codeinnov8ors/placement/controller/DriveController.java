package com.codeinnov8ors.placement.controller;

import java.time.Instant;

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

import com.codeinnov8ors.placement.dto.drive.DriveRequest;
import com.codeinnov8ors.placement.dto.drive.DriveResponse;
import com.codeinnov8ors.placement.dto.drive.DriveStatusRequest;
import com.codeinnov8ors.placement.service.DriveService;

import jakarta.validation.Valid;

@RestController
@org.springframework.context.annotation.Profile("!test")
@Validated
@RequestMapping("/api/drives")
public class DriveController {
	private final DriveService service;
	public DriveController(DriveService service) { this.service = service; }

	@GetMapping public ResponseEntity<Page<DriveResponse>> list(@RequestParam(required = false) String q,
		@RequestParam(required = false) String status, @RequestParam(required = false) Instant deadlineFrom,
		@RequestParam(required = false) Instant deadlineTo, @RequestParam(defaultValue = "0") int page,
		@RequestParam(defaultValue = "20") int size, Authentication auth) {
		if (page < 0 || size < 1 || size > 100 || (deadlineFrom != null && deadlineTo != null && deadlineFrom.isAfter(deadlineTo))) return ResponseEntity.badRequest().build();
		return ResponseEntity.ok(service.list(q, status, deadlineFrom, deadlineTo, PageRequest.of(page, size, Sort.by("startDate").ascending()), auth));
	}
	@GetMapping("/{id}") public DriveResponse get(@PathVariable Long id, Authentication auth) { return service.get(id, auth); }
	@PostMapping public ResponseEntity<DriveResponse> create(@Valid @RequestBody DriveRequest request, Authentication auth) { return ResponseEntity.status(HttpStatus.CREATED).body(service.create(request, auth)); }
	@PutMapping("/{id}") public DriveResponse update(@PathVariable Long id, @Valid @RequestBody DriveRequest request, Authentication auth) { return service.update(id, request, auth); }
	@PatchMapping("/{id}/status") public DriveResponse updateStatus(@PathVariable Long id, @Valid @RequestBody DriveStatusRequest request, Authentication auth) { return service.updateStatus(id, request.status(), auth); }
}
