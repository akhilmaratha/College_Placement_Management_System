package com.codeinnov8ors.placement.controller;

import java.util.List;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;
import com.codeinnov8ors.placement.dto.interview.*;
import com.codeinnov8ors.placement.service.InterviewService;
import jakarta.validation.Valid;

@RestController
@org.springframework.context.annotation.Profile("!test")
@Validated
@RequestMapping("/api/interviews")
public class InterviewController {
    private final InterviewService service;
    public InterviewController(InterviewService service) { this.service = service; }
    @PostMapping public ResponseEntity<InterviewResponse> create(@Valid @RequestBody InterviewRequest body, Authentication auth) {
        return ResponseEntity.status(HttpStatus.CREATED).body(service.create(body, auth));
    }
    @GetMapping public List<InterviewResponse> list(Authentication auth) { return service.list(auth); }
    @GetMapping("/{id}") public InterviewResponse get(@PathVariable Long id, Authentication auth) { return service.get(id, auth); }
    @PutMapping("/{id}") public InterviewResponse update(@PathVariable Long id, @Valid @RequestBody InterviewRequest body, Authentication auth) { return service.update(id, body, auth); }
    @PatchMapping("/{id}/status") public InterviewResponse status(@PathVariable Long id, @Valid @RequestBody InterviewStatusRequest body, Authentication auth) { return service.updateStatus(id, body, auth); }
    @DeleteMapping("/{id}") public ResponseEntity<Void> cancel(@PathVariable Long id, Authentication auth) { service.cancel(id, auth); return ResponseEntity.noContent().build(); }
}
