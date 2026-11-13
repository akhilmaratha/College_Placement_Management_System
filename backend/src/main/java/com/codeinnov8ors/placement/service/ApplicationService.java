package com.codeinnov8ors.placement.service;

import java.time.Instant;
import java.util.ArrayList;
import java.util.List;
import java.util.Locale;

import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.codeinnov8ors.placement.dto.application.ApplicationResponse;
import com.codeinnov8ors.placement.dto.application.EligibilityResponse;
import com.codeinnov8ors.placement.entity.*;
import com.codeinnov8ors.placement.entity.enums.*;
import com.codeinnov8ors.placement.repository.*;

@Service
@org.springframework.context.annotation.Profile("!test")
@Transactional(readOnly = true)
public class ApplicationService {
    private final ApplicationRepository applications;
    private final UserRepository users;
    private final StudentProfileRepository students;
    private final AcademicRecordRepository academics;
    private final JobOpeningRepository jobs;
    private final ResumeRepository resumes;
    private final RecruiterProfileRepository recruiters;
    private final JobSkillRepository jobSkills;
    private final StudentSkillRepository studentSkills;
    private final ApplicationStatusHistoryRepository history;

    public ApplicationService(ApplicationRepository applications, UserRepository users, StudentProfileRepository students,
            AcademicRecordRepository academics, JobOpeningRepository jobs, ResumeRepository resumes,
            RecruiterProfileRepository recruiters, JobSkillRepository jobSkills, StudentSkillRepository studentSkills,
            ApplicationStatusHistoryRepository history) {
        this.applications = applications; this.users = users; this.students = students; this.academics = academics;
        this.jobs = jobs; this.resumes = resumes; this.recruiters = recruiters; this.jobSkills = jobSkills; this.studentSkills = studentSkills; this.history = history;
    }

    public EligibilityResponse eligibility(Long jobId, Authentication auth) {
        requireRole(auth, "STUDENT");
        StudentProfile student = ownStudent(auth);
        JobOpening job = job(jobId);
        return evaluate(job, student);
    }

    @Transactional
    public ApplicationResponse apply(Long jobId, Authentication auth) {
        requireRole(auth, "STUDENT");
        StudentProfile student = ownStudent(auth);
        JobOpening job = job(jobId);
        if (job.getStatus() != JobOpeningStatus.PUBLISHED) throw new IllegalArgumentException("Job is not open for applications");
        if (!job.getApplicationDeadline().isAfter(Instant.now())) throw new IllegalArgumentException("Application deadline has passed");
        EligibilityResponse result = evaluate(job, student);
        if (!result.eligible()) throw new IllegalArgumentException("Not eligible: " + String.join("; ", result.reasons()));
        if (applications.findByStudentProfileIdAndJobOpeningId(student.getId(), jobId).isPresent()) throw new IllegalArgumentException("Application already exists");
        Resume resume = resumes.findFirstByStudentProfileIdAndDefaultResumeTrueOrderByUploadedAtDesc(student.getId())
            .orElseThrow(() -> new IllegalArgumentException("Upload and select a default resume before applying"));
        Application application = new Application(); application.setStudentProfile(student); application.setJobOpening(job);
        application.setResume(resume); application.setCurrentStatus(ApplicationStatus.APPLIED);
        try {
            Application saved = applications.saveAndFlush(application);
            recordStatus(saved, null, ApplicationStatus.APPLIED, users.findById(student.getUser().getId()).orElseThrow(() -> denied()));
            return ApplicationResponse.from(saved);
        }
        catch (org.springframework.dao.DataIntegrityViolationException ex) { throw new IllegalArgumentException("Application already exists"); }
    }

    public List<ApplicationResponse> mine(Authentication auth) {
        requireRole(auth, "STUDENT");
        return applications.findByStudentProfileId(ownStudent(auth).getId()).stream().map(ApplicationResponse::from).toList();
    }

    public List<ApplicationResponse> recruiterApplications(Authentication auth) {
        requireRole(auth, "RECRUITER");
        return applications.findByJobOpeningCompanyId(ownCompanyId(auth)).stream().map(ApplicationResponse::from).toList();
    }

    public List<ApplicationResponse> managedApplications(Authentication auth) {
        requireRole(auth, "PLACEMENT_OFFICER", "ADMIN");
        return applications.findAll().stream().map(ApplicationResponse::from).toList();
    }

    public ApplicationResponse get(Long id, Authentication auth) {
        Application a = application(id); authorizeView(a, auth); return ApplicationResponse.from(a);
    }

    @Transactional
    public ApplicationResponse updateStatus(Long id, String value, Authentication auth) {
        Application a = application(id);
        boolean recruiter = hasRole(auth, "RECRUITER");
        if (recruiter) {
            if (!a.getJobOpening().getCompany().getId().equals(ownCompanyId(auth))) throw denied();
        } else requireRole(auth, "PLACEMENT_OFFICER", "ADMIN");
        ApplicationStatus next = parseStatus(value), current = a.getCurrentStatus();
        if (next == current) return ApplicationResponse.from(a);
        boolean allowed = switch (current) {
            case APPLIED -> next == ApplicationStatus.SHORTLISTED || next == ApplicationStatus.REJECTED;
            case SHORTLISTED -> next == ApplicationStatus.INTERVIEW_SCHEDULED || next == ApplicationStatus.REJECTED;
            case INTERVIEW_SCHEDULED -> next == ApplicationStatus.SELECTED || next == ApplicationStatus.REJECTED;
            default -> false;
        };
        if (!allowed) throw new IllegalArgumentException("Invalid application status transition");
        a.setCurrentStatus(next); recordStatus(a, current, next, users.findById(userId(auth)).orElseThrow(() -> denied()));
        return ApplicationResponse.from(a);
    }

    private EligibilityResponse evaluate(JobOpening job, StudentProfile student) {
        List<String> reasons = new ArrayList<>();
        if (job.getStatus() != JobOpeningStatus.PUBLISHED) reasons.add("Job is not published");
        if (!job.getApplicationDeadline().isAfter(Instant.now())) reasons.add("Application deadline has passed");
        AcademicRecord record = academics.findByStudentProfileId(student.getId()).orElse(null);
        if (record == null) reasons.add("Academic record is missing");
        else {
            if (record.getVerificationStatus() != AcademicVerificationStatus.VERIFIED) reasons.add("Academic record is not verified");
            if (record.getCurrentCgpa().compareTo(job.getMinCgpa()) < 0) reasons.add("CGPA is below the minimum " + job.getMinCgpa());
            String allowed = job.getAllowedBranches() == null ? "" : job.getAllowedBranches().trim();
            if (!allowed.isBlank() && !allowed.equalsIgnoreCase("ALL")) {
                boolean branchMatches = java.util.Arrays.stream(allowed.split("[,;]")).map(String::trim).anyMatch(b -> b.equalsIgnoreCase(record.getDepartmentBranch()));
                if (!branchMatches) reasons.add("Department is not included in the allowed branches");
            }
            if (job.getBatchYear() != null && !job.getBatchYear().equals(record.getGraduationYear())) reasons.add("Graduation year does not match " + job.getBatchYear());
            if (record.getActiveBacklogs() > job.getMaxActiveBacklogs()) reasons.add("Active backlogs exceed the maximum " + job.getMaxActiveBacklogs());
        }
        List<String> missingSkills = jobSkills.findByJobOpeningId(job.getId()).stream().filter(JobSkill::isMandatory)
            .filter(js -> studentSkills.findByStudentProfileId(student.getId()).stream().noneMatch(ss -> ss.getSkill().getId().equals(js.getSkill().getId())))
            .map(js -> js.getSkill().getSkillName()).toList();
        if (!missingSkills.isEmpty()) reasons.add("Missing required skills: " + String.join(", ", missingSkills));
        return new EligibilityResponse(job.getId(), reasons.isEmpty(), reasons);
    }

    private StudentProfile ownStudent(Authentication auth) { return students.findByUserId(userId(auth)).orElseThrow(() -> new IllegalArgumentException("Student profile not found")); }
    private Long ownCompanyId(Authentication auth) { return recruiters.findByUserId(userId(auth)).orElseThrow(() -> denied()).getCompany().getId(); }
    private Long userId(Authentication auth) { return users.findByEmail(auth.getName().toLowerCase(Locale.ROOT)).orElseThrow(() -> denied()).getId(); }
    private JobOpening job(Long id) { return jobs.findById(id).orElseThrow(() -> new IllegalArgumentException("Job not found")); }
    private Application application(Long id) { return applications.findById(id).orElseThrow(() -> new IllegalArgumentException("Application not found")); }
    private void authorizeView(Application a, Authentication auth) {
        if (hasRole(auth, "STUDENT")) { if (!a.getStudentProfile().getUser().getId().equals(userId(auth))) throw denied(); }
        else if (hasRole(auth, "RECRUITER")) { if (!a.getJobOpening().getCompany().getId().equals(ownCompanyId(auth))) throw denied(); }
        else requireRole(auth, "PLACEMENT_OFFICER", "ADMIN");
    }
    private void requireRole(Authentication auth, String... roles) { if (!hasRole(auth, roles)) throw denied(); }
    private boolean hasRole(Authentication auth, String... roles) { return auth != null && auth.getAuthorities().stream().anyMatch(a -> java.util.Arrays.stream(roles).anyMatch(r -> a.getAuthority().equals("ROLE_" + r))); }
    private AccessDeniedException denied() { return new AccessDeniedException("Not authorized to access this application"); }
    private ApplicationStatus parseStatus(String s) { for (ApplicationStatus x : ApplicationStatus.values()) if (x.getDbValue().equalsIgnoreCase(s.trim())) return x; throw new IllegalArgumentException("Unsupported application status"); }
    private void recordStatus(Application application, ApplicationStatus from, ApplicationStatus to, User user) {
        ApplicationStatusHistory entry = new ApplicationStatusHistory(); entry.setApplication(application); entry.setFromStatus(from);
        entry.setToStatus(to); entry.setChangedBy(user); history.save(entry);
    }
}
