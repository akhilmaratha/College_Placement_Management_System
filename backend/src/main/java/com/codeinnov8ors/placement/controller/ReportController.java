package com.codeinnov8ors.placement.controller;

import java.time.LocalDate;
import org.springframework.data.domain.Page;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import com.codeinnov8ors.placement.dto.report.*;
import com.codeinnov8ors.placement.repository.ReportRepository;
import com.codeinnov8ors.placement.service.ReportService;

@RestController
@org.springframework.context.annotation.Profile("!test")
@RequestMapping("/api/reports")
public class ReportController {
    private final ReportService service;
    public ReportController(ReportService service) { this.service=service; }
    @GetMapping("/placement-summary") public PlacementSummaryReport summary(@RequestParam(required=false) LocalDate from,@RequestParam(required=false) LocalDate to,Authentication auth) { return service.summary(from,to,auth); }
    @GetMapping("/applications") public Page<ApplicationReportRow> applications(@RequestParam(required=false) LocalDate from,@RequestParam(required=false) LocalDate to,@RequestParam(required=false) Long companyId,@RequestParam(required=false) Long jobId,@RequestParam(required=false) String status,@RequestParam(defaultValue="0") int page,@RequestParam(defaultValue="20") int size,Authentication auth) { return service.applications(from,to,companyId,jobId,status,page,size,auth); }
    @GetMapping("/companies") public Page<ReportRepository.CompanyReport> companies(@RequestParam(required=false) LocalDate from,@RequestParam(required=false) LocalDate to,@RequestParam(defaultValue="0") int page,@RequestParam(defaultValue="20") int size,Authentication auth) { return service.companies(from,to,page,size,auth); }
    @GetMapping("/jobs") public Page<ReportRepository.JobReport> jobs(@RequestParam(required=false) LocalDate from,@RequestParam(required=false) LocalDate to,@RequestParam(required=false) Long companyId,@RequestParam(defaultValue="0") int page,@RequestParam(defaultValue="20") int size,Authentication auth) { return service.jobs(from,to,companyId,page,size,auth); }
    @GetMapping("/drives") public Page<ReportRepository.DriveReport> drives(@RequestParam(required=false) LocalDate from,@RequestParam(required=false) LocalDate to,@RequestParam(defaultValue="0") int page,@RequestParam(defaultValue="20") int size,Authentication auth) { return service.drives(from,to,page,size,auth); }
    @GetMapping("/interviews") public Page<InterviewReportRow> interviews(@RequestParam(required=false) LocalDate from,@RequestParam(required=false) LocalDate to,@RequestParam(required=false) Long companyId,@RequestParam(required=false) Long jobId,@RequestParam(required=false) String status,@RequestParam(defaultValue="0") int page,@RequestParam(defaultValue="20") int size,Authentication auth) { return service.interviews(from,to,companyId,jobId,status,page,size,auth); }
}
