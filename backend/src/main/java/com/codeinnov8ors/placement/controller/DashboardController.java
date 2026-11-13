package com.codeinnov8ors.placement.controller;

import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import com.codeinnov8ors.placement.dto.dashboard.DashboardResponse;
import com.codeinnov8ors.placement.service.DashboardService;

@RestController
@org.springframework.context.annotation.Profile("!test")
@RequestMapping("/api/dashboard")
public class DashboardController {
    private final DashboardService service;
    public DashboardController(DashboardService service) { this.service=service; }
    @GetMapping("/student") public DashboardResponse student(Authentication auth) { return service.student(auth); }
    @GetMapping("/recruiter") public DashboardResponse recruiter(Authentication auth) { return service.recruiter(auth); }
    @GetMapping("/placement-officer") public DashboardResponse placementOfficer(Authentication auth) { return service.placementOfficer(auth); }
    @GetMapping("/admin") public DashboardResponse admin(Authentication auth) { return service.admin(auth); }
}
