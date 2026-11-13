package com.codeinnov8ors.placement.service;

import java.time.Instant;
import java.time.LocalDate;
import java.time.ZoneId;
import java.util.List;
import java.util.Locale;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import com.codeinnov8ors.placement.dto.report.*;
import com.codeinnov8ors.placement.entity.enums.*;
import com.codeinnov8ors.placement.repository.*;

@Service
@org.springframework.context.annotation.Profile("!test")
@Transactional(readOnly = true)
public class ReportService {
    private static final ZoneId REPORT_ZONE=ZoneId.of("Asia/Kolkata");
    private final UserRepository users; private final StudentProfileRepository students; private final CompanyRepository companies;
    private final JobOpeningRepository jobs; private final PlacementDriveRepository drives; private final ReportRepository reports;
    public ReportService(UserRepository users,StudentProfileRepository students,CompanyRepository companies,JobOpeningRepository jobs,PlacementDriveRepository drives,ReportRepository reports) {
        this.users=users;this.students=students;this.companies=companies;this.jobs=jobs;this.drives=drives;this.reports=reports;
    }
    public PlacementSummaryReport summary(LocalDate from,LocalDate to,Authentication auth) {
        authorize(auth); Bounds b=bounds(from,to);
        return new PlacementSummaryReport(students.count(),companies.count(),jobs.countByStatus(JobOpeningStatus.PUBLISHED),
            drives.countByStatusIn(List.of(DriveStatus.OPEN,DriveStatus.IN_PROGRESS)),reports.applicationCount(b.from,b.to),
            reports.applicationStatusCount(ApplicationStatus.SHORTLISTED,b.from,b.to),reports.applicationStatusCount(ApplicationStatus.SELECTED,b.from,b.to),
            reports.interviewCount(b.from,b.to),reports.interviews(b.from,b.to,null,null,InterviewRoundStatus.COMPLETED,PageRequest.of(0,1)).getTotalElements());
    }
    public Page<ApplicationReportRow> applications(LocalDate from,LocalDate to,Long companyId,Long jobId,String rawStatus,int page,int size,Authentication auth) {
        authorize(auth); Bounds b=bounds(from,to); ApplicationStatus status=rawStatus==null||rawStatus.isBlank()?null:parse(ApplicationStatus.values(),rawStatus);
        return reports.applications(b.from,b.to,companyId,jobId,status,page(page,size,"appliedAt"));
    }
    public Page<ReportRepository.CompanyReport> companies(LocalDate from,LocalDate to,int page,int size,Authentication auth) {
        authorize(auth); Bounds b=bounds(from,to); return reports.companies(b.from,b.to,ApplicationStatus.SHORTLISTED,ApplicationStatus.SELECTED,page(page,size,"companyName"));
    }
    public Page<ReportRepository.JobReport> jobs(LocalDate from,LocalDate to,Long companyId,int page,int size,Authentication auth) {
        authorize(auth); Bounds b=bounds(from,to); return reports.jobs(b.from,b.to,companyId,ApplicationStatus.SHORTLISTED,ApplicationStatus.SELECTED,page(page,size,"jobTitle"));
    }
    public Page<ReportRepository.DriveReport> drives(LocalDate from,LocalDate to,int page,int size,Authentication auth) {
        authorize(auth); Bounds b=bounds(from,to); return reports.drives(b.from,b.to,ApplicationStatus.SHORTLISTED,ApplicationStatus.SELECTED,page(page,size,"startDate"));
    }
    public Page<InterviewReportRow> interviews(LocalDate from,LocalDate to,Long companyId,Long jobId,String rawStatus,int page,int size,Authentication auth) {
        authorize(auth); Bounds b=bounds(from,to); InterviewRoundStatus status=rawStatus==null||rawStatus.isBlank()?null:parse(InterviewRoundStatus.values(),rawStatus);
        return reports.interviews(b.from,b.to,companyId,jobId,status,page(page,size,"scheduledAt"));
    }
    private PageRequest page(int page,int size,String field) { if(page<0||size<1||size>100) throw new IllegalArgumentException("Page must be non-negative and size must be between 1 and 100"); return PageRequest.of(page,size,Sort.by(Sort.Direction.DESC,field)); }
    private Bounds bounds(LocalDate from,LocalDate to) { if(from!=null&&to!=null&&from.isAfter(to)) throw new IllegalArgumentException("from must be on or before to"); return new Bounds(from==null?null:from.atStartOfDay(REPORT_ZONE).toInstant(),to==null?null:to.plusDays(1).atStartOfDay(REPORT_ZONE).toInstant()); }
    private void authorize(Authentication auth) { if(auth==null||auth.getAuthorities().stream().noneMatch(a->a.getAuthority().equals("ROLE_ADMIN")||a.getAuthority().equals("ROLE_PLACEMENT_OFFICER"))) throw new AccessDeniedException("Not authorized to access placement reports"); }
    private <E extends Enum<E>&DbEnum> E parse(E[] values,String value) { for(E v:values) if(v.getDbValue().equalsIgnoreCase(value.trim())||v.name().equalsIgnoreCase(value.trim())) return v; throw new IllegalArgumentException("Unsupported report status"); }
    private record Bounds(Instant from,Instant to) {}
}
