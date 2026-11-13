package com.codeinnov8ors.placement.controller;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.validation.annotation.Validated;
import org.springframework.context.annotation.Profile;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.codeinnov8ors.placement.dto.student.StudentProfileResponse;
import com.codeinnov8ors.placement.dto.student.StudentProfileUpdateRequest;
import com.codeinnov8ors.placement.service.StudentService;

import jakarta.validation.Valid;

@RestController
@Profile("!test")
@Validated
@RequestMapping("/api/students")
public class StudentController {
	private final StudentService service;
	public StudentController(StudentService service) { this.service = service; }

	@GetMapping("/me") public StudentProfileResponse me(Authentication auth) { return service.me(auth); }
	@PutMapping("/me") public StudentProfileResponse updateMe(Authentication auth, @Valid @RequestBody StudentProfileUpdateRequest request) { return service.updateMe(auth, request); }
	@GetMapping("/{id}") public StudentProfileResponse byId(@PathVariable Long id, Authentication auth) { return service.byId(id, auth); }
	@GetMapping public ResponseEntity<Page<StudentProfileResponse>> directory(@RequestParam(required = false) String q,
		@RequestParam(defaultValue = "0") int page, @RequestParam(defaultValue = "20") int size, Authentication auth) {
		if (page < 0 || size < 1 || size > 100) return ResponseEntity.badRequest().build();
		return ResponseEntity.ok(service.directory(q, PageRequest.of(page, size, Sort.by("fullName").ascending()), auth));
	}
}
