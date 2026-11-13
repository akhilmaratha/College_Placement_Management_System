package com.codeinnov8ors.placement.service;

import java.time.Instant;
import java.util.List;
import java.util.Locale;

import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.codeinnov8ors.placement.dto.dashboard.DashboardResponse;
import com.codeinnov8ors.placement.dto.dashboard.DashboardResponse.*;
import com.codeinnov8ors.placement.entity.*;
import com.codeinnov8ors.placement.entity.enums.*;
import com.codeinnov8ors.placement.repository.*;

@Service
@org.springframework.context.annotation.Profile("!test")
@Transactional(readOnly = true)
public class DashboardService {
    private static final List<InterviewRoundStatus> UPCOMING = List.of(InterviewRoundStatus.SCHEDULED, InterviewRoundStatus.RESCHEDULED);
    private static final List<DriveStatus> ACTIVE_DRIVES = List.of(DriveStatus.OPEN, DriveStatus.IN_PROGRESS);
    private static final List<DriveStatus> PLANNED_DRIVES = List.of(DriveStatus.UPCOMING, DriveStatus.OPEN, DriveStatus.IN_PROGRESS);
    private final UserRepository users;
    private final StudentProfileRepository students;
    private final CompanyRepository companies;
    private final RecruiterProfileRepository recruiters;
    private final JobOpeningRepository jobs;
    private final PlacementDriveRepository drives;
    private final ApplicationRepository applications;
    private final InterviewRoundRepository interviews;

    public DashboardService(UserRepository users, StudentProfileRepository students, CompanyRepository companies,
            RecruiterProfileRepository recruiters, JobOpeningRepository jobs, PlacementDriveRepository drives,
            ApplicationRepository applications, InterviewRoundRepository interviews) {
        this.users=users; this.students=students; this.companies=companies; this.recruiters=recruiters;
        this.jobs=jobs; this.drives=drives; this.applications=applications; this.interviews=interviews;
    }

    public DashboardResponse student(Authentication auth) {
        requireRole(auth, "STUDENT");
        StudentProfile student = students.findByUserId(userId(auth)).orElseThrow(() -> new IllegalArgumentException("Student profile not found"));
        Long studentId = student.getId(); Instant now = Instant.now();
        DashboardStats stats = blankStats();
        stats = new DashboardStats(0, 1, 0, 0, 0, 0, 0, 0, 0,
            applications.countByStudentProfileId(studentId), activeApplicationCountForStudent(studentId),
            applications.countByStudentProfileIdAndCurrentStatus(studentId, ApplicationStatus.SHORTLISTED), 0,
            applications.countByStudentProfileIdAndCurrentStatus(studentId, ApplicationStatus.SELECTED),
            interviews.countByApplicationStudentProfileIdAndScheduledAtAfterAndStatusIn(studentId, now, UPCOMING),
            jobs.countByStatusAndApplicationDeadlineAfter(JobOpeningStatus.PUBLISHED, now));
        var recent = applications.findTop5ByStudentProfileIdOrderByAppliedAtDesc(studentId).stream().map(this::applicationRow).toList();
        var upcoming = interviews.findTop5ByApplicationStudentProfileIdAndScheduledAtAfterAndStatusInOrderByScheduledAtAsc(studentId, now, UPCOMING).stream().map(this::interviewRow).toList();
        var openJobs=jobs.findTop5ByStatusAndApplicationDeadlineAfterOrderByApplicationDeadlineAsc(JobOpeningStatus.PUBLISHED,now);
        return new DashboardResponse(student.getFullName(), null, student.isProfileComplete(), stats, jobRows(openJobs), recent, upcoming, List.of(), List.of());
    }

    public DashboardResponse recruiter(Authentication auth) {
        requireRole(auth, "RECRUITER");
        RecruiterProfile profile = recruiters.findByUserId(userId(auth)).orElseThrow(() -> denied());
        Long companyId=profile.getCompany().getId(); Instant now=Instant.now();
        var recentJobs=jobRows(jobs.findTop5ByCompanyIdOrderByUpdatedAtDesc(companyId));
        var recent=applications.findTop5ByJobOpeningCompanyIdOrderByAppliedAtDesc(companyId).stream().map(this::applicationRow).toList();
        var upcoming=interviews.findTop5ByApplicationJobOpeningCompanyIdAndScheduledAtAfterAndStatusInOrderByScheduledAtAsc(companyId, now, UPCOMING).stream().map(this::interviewRow).toList();
        long active=applications.countByJobOpeningCompanyIdAndCurrentStatus(companyId, ApplicationStatus.APPLIED)
            + applications.countByJobOpeningCompanyIdAndCurrentStatus(companyId, ApplicationStatus.SHORTLISTED)
            + applications.countByJobOpeningCompanyIdAndCurrentStatus(companyId, ApplicationStatus.INTERVIEW_SCHEDULED);
        DashboardStats stats = new DashboardStats(0,0,0,0,jobs.countByCompanyId(companyId),jobs.countByCompanyIdAndStatusAndApplicationDeadlineAfter(companyId, JobOpeningStatus.PUBLISHED,now),jobs.countByCompanyIdAndStatus(companyId, JobOpeningStatus.CLOSED),0,0,
            applications.countByJobOpeningCompanyId(companyId),active,applications.countByJobOpeningCompanyIdAndCurrentStatus(companyId,ApplicationStatus.SHORTLISTED),applications.countByJobOpeningCompanyIdAndCurrentStatus(companyId,ApplicationStatus.REJECTED),applications.countByJobOpeningCompanyIdAndCurrentStatus(companyId,ApplicationStatus.SELECTED),
            interviews.countByApplicationJobOpeningCompanyIdAndScheduledAtAfterAndStatusIn(companyId,now,UPCOMING),0);
        return new DashboardResponse(profile.getUser().getEmail(), profile.getCompany().getName(), false, stats, recentJobs, recent, upcoming, List.of(), List.of());
    }

    public DashboardResponse placementOfficer(Authentication auth) {
        requireRole(auth, "PLACEMENT_OFFICER", "ADMIN");
        Instant now=Instant.now(); DashboardStats stats=systemStats(now);
        var recent=applications.findTop5ByOrderByAppliedAtDesc().stream().map(this::applicationRow).toList();
        var upcoming=interviews.findTop5ByScheduledAtAfterAndStatusInOrderByScheduledAtAsc(now, UPCOMING).stream().map(this::interviewRow).toList();
        var upcomingDrives=drives.findTop5ByStatusInOrderByStartDateAsc(PLANNED_DRIVES).stream().map(d -> new DashboardDrive(d.getId(),d.getTitle(),d.getStartDate(),d.getEndDate(),d.getStatus().getDbValue())).toList();
        return new DashboardResponse(null,null,false,stats,jobRows(jobs.findTop5ByOrderByUpdatedAtDesc()),recent,upcoming,upcomingDrives,List.of());
    }

    public DashboardResponse admin(Authentication auth) {
        requireRole(auth,"ADMIN"); Instant now=Instant.now(); DashboardStats stats=systemStats(now);
        var recent=applications.findTop5ByOrderByAppliedAtDesc().stream().map(this::applicationRow).toList();
        var upcoming=interviews.findTop5ByScheduledAtAfterAndStatusInOrderByScheduledAtAsc(now,UPCOMING).stream().map(this::interviewRow).toList();
        var planned=drives.findTop5ByStatusInOrderByStartDateAsc(PLANNED_DRIVES).stream().map(d -> new DashboardDrive(d.getId(),d.getTitle(),d.getStartDate(),d.getEndDate(),d.getStatus().getDbValue())).toList();
        var recentUsers=users.findTop5ByOrderByCreatedAtDesc().stream().map(u -> new DashboardUser(u.getId(),u.getRole().name(),u.getStatus().name(),u.getCreatedAt())).toList();
        return new DashboardResponse(null,null,false,stats,jobRows(jobs.findTop5ByOrderByUpdatedAtDesc()),recent,upcoming,planned,recentUsers);
    }

    private DashboardStats systemStats(Instant now) {
        long activeApps=applications.countByCurrentStatus(ApplicationStatus.APPLIED)+applications.countByCurrentStatus(ApplicationStatus.SHORTLISTED)+applications.countByCurrentStatus(ApplicationStatus.INTERVIEW_SCHEDULED);
        return new DashboardStats(users.count(),students.count(),users.countByRole(UserRole.RECRUITER),companies.count(),jobs.count(),jobs.countByStatusAndApplicationDeadlineAfter(JobOpeningStatus.PUBLISHED,now),jobs.countByStatus(JobOpeningStatus.CLOSED),drives.count(),drives.countByStatusIn(ACTIVE_DRIVES),applications.count(),activeApps,applications.countByCurrentStatus(ApplicationStatus.SHORTLISTED),applications.countByCurrentStatus(ApplicationStatus.REJECTED),applications.countByCurrentStatus(ApplicationStatus.SELECTED),interviews.countByScheduledAtAfterAndStatusIn(now,UPCOMING),0);
    }
    private DashboardStats blankStats() { return new DashboardStats(0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0); }
    private long activeApplicationCountForStudent(Long id) { return applications.countByStudentProfileIdAndCurrentStatus(id,ApplicationStatus.APPLIED)+applications.countByStudentProfileIdAndCurrentStatus(id,ApplicationStatus.SHORTLISTED)+applications.countByStudentProfileIdAndCurrentStatus(id,ApplicationStatus.INTERVIEW_SCHEDULED); }
    private DashboardApplication applicationRow(Application a) { return new DashboardApplication(a.getId(),a.getJobOpening().getId(),a.getJobOpening().getTitle(),a.getJobOpening().getCompany().getName(),a.getStudentProfile().getFullName(),a.getCurrentStatus().getDbValue(),a.getAppliedAt()); }
    private List<DashboardJob> jobRows(List<JobOpening> openings) {
        if(openings.isEmpty()) return List.of();
        var counts=jobs.countApplicantsByJobIds(openings.stream().map(JobOpening::getId).toList()).stream().collect(java.util.stream.Collectors.toMap(JobOpeningRepository.JobApplicantCount::getJobId,JobOpeningRepository.JobApplicantCount::getApplicantCount));
        return openings.stream().map(j->new DashboardJob(j.getId(),j.getTitle(),j.getStatus().getDbValue(),j.getApplicationDeadline(),j.getCompany().getName(),counts.getOrDefault(j.getId(),0L))).toList();
    }
    private DashboardInterview interviewRow(InterviewRound i) { var a=i.getApplication(); return new DashboardInterview(i.getId(),a.getId(),a.getJobOpening().getId(),a.getJobOpening().getTitle(),a.getJobOpening().getCompany().getName(),a.getStudentProfile().getFullName(),i.getRoundNumber(),i.getRoundName(),i.getScheduledAt(),i.getStatus().getDbValue()); }
    private Long userId(Authentication auth) { return users.findByEmail(auth.getName().toLowerCase(Locale.ROOT)).orElseThrow(this::denied).getId(); }
    private boolean hasRole(Authentication a,String... roles) { return a!=null&&a.getAuthorities().stream().anyMatch(x->java.util.Arrays.stream(roles).anyMatch(r->x.getAuthority().equals("ROLE_"+r))); }
    private void requireRole(Authentication a,String... roles) { if(!hasRole(a,roles)) throw denied(); }
    private AccessDeniedException denied() { return new AccessDeniedException("Not authorized to access this dashboard"); }
}
