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

import com.codeinnov8ors.placement.dto.job.JobRequest;
import com.codeinnov8ors.placement.dto.job.JobResponse;
import com.codeinnov8ors.placement.dto.job.JobStatusRequest;
import com.codeinnov8ors.placement.service.JobService;

import jakarta.validation.Valid;

@RestController
@org.springframework.context.annotation.Profile("!test")
@Validated
@RequestMapping("/api/jobs")
public class JobController {
	private final JobService service;
	public JobController(JobService service) { this.service = service; }

	@GetMapping public ResponseEntity<Page<JobResponse>> list(@RequestParam(required = false) String q,
		@RequestParam(required = false) Long companyId, @RequestParam(required = false) String location,
		@RequestParam(required = false) String jobType, @RequestParam(required = false) String status,
		@RequestParam(required = false) Instant deadlineFrom, @RequestParam(required = false) Instant deadlineTo,
		@RequestParam(defaultValue = "0") int page, @RequestParam(defaultValue = "20") int size, Authentication auth) {
		if (page < 0 || size < 1 || size > 100 || (deadlineFrom != null && deadlineTo != null && deadlineFrom.isAfter(deadlineTo))) return ResponseEntity.badRequest().build();
		return ResponseEntity.ok(service.list(q, companyId, location, jobType, status, deadlineFrom, deadlineTo,
			PageRequest.of(page, size, Sort.by("applicationDeadline").ascending()), auth));
	}
	@GetMapping("/{id}") public JobResponse get(@PathVariable Long id, Authentication auth) { return service.get(id, auth); }
	@PostMapping public ResponseEntity<JobResponse> create(@Valid @RequestBody JobRequest request, Authentication auth) { return ResponseEntity.status(HttpStatus.CREATED).body(service.create(request, auth)); }
	@PutMapping("/{id}") public JobResponse update(@PathVariable Long id, @Valid @RequestBody JobRequest request, Authentication auth) { return service.update(id, request, auth); }
	@PatchMapping("/{id}/status") public JobResponse updateStatus(@PathVariable Long id, @Valid @RequestBody JobStatusRequest request, Authentication auth) { return service.updateStatus(id, request.status(), auth); }
}
