package com.codeinnov8ors.placement.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import com.codeinnov8ors.placement.dto.application.*;
import com.codeinnov8ors.placement.service.ApplicationService;

import jakarta.validation.Valid;

@RestController
@org.springframework.context.annotation.Profile("!test")
@Validated
public class ApplicationController {
    private final ApplicationService service;
    public ApplicationController(ApplicationService service) { this.service = service; }

    @GetMapping("/api/jobs/{jobId}/eligibility")
    public EligibilityResponse eligibility(@PathVariable Long jobId, Authentication auth) { return service.eligibility(jobId, auth); }
    @PostMapping("/api/jobs/{jobId}/applications")
    public ResponseEntity<ApplicationResponse> apply(@PathVariable Long jobId, Authentication auth) { return ResponseEntity.status(HttpStatus.CREATED).body(service.apply(jobId, auth)); }
    @GetMapping("/api/applications/me")
    public List<ApplicationResponse> mine(Authentication auth) { return service.mine(auth); }
    @GetMapping("/api/applications/{id}")
    public ApplicationResponse get(@PathVariable Long id, Authentication auth) { return service.get(id, auth); }
    @GetMapping("/api/applications")
    public List<ApplicationResponse> managed(Authentication auth) { return service.managedApplications(auth); }
    @PatchMapping("/api/applications/{id}/status")
    public ApplicationResponse update(@PathVariable Long id, @Valid @RequestBody ApplicationStatusRequest body, Authentication auth) { return service.updateStatus(id, body.status(), auth); }
    @GetMapping("/api/recruiter/applications")
    public List<ApplicationResponse> recruiterList(Authentication auth) { return service.recruiterApplications(auth); }
    @GetMapping("/api/recruiter/applications/{id}")
    public ApplicationResponse recruiterGet(@PathVariable Long id, Authentication auth) { return service.get(id, auth); }
    @PatchMapping("/api/recruiter/applications/{id}/status")
    public ApplicationResponse recruiterUpdate(@PathVariable Long id, @Valid @RequestBody ApplicationStatusRequest body, Authentication auth) { return service.updateStatus(id, body.status(), auth); }
    @GetMapping("/api/placement/applications")
    public List<ApplicationResponse> placementList(Authentication auth) { return service.managedApplications(auth); }
    @PatchMapping("/api/placement/applications/{id}/status")
    public ApplicationResponse placementUpdate(@PathVariable Long id, @Valid @RequestBody ApplicationStatusRequest body, Authentication auth) { return service.updateStatus(id, body.status(), auth); }
}
