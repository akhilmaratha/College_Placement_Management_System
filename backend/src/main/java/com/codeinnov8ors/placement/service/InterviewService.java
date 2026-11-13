package com.codeinnov8ors.placement.service;

import java.time.Instant;
import java.util.List;
import java.util.Locale;

import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.codeinnov8ors.placement.dto.interview.*;
import com.codeinnov8ors.placement.entity.*;
import com.codeinnov8ors.placement.entity.enums.*;
import com.codeinnov8ors.placement.repository.*;

@Service
@org.springframework.context.annotation.Profile("!test")
@Transactional(readOnly = true)
public class InterviewService {
    private final InterviewRoundRepository interviews;
    private final ApplicationRepository applications;
    private final UserRepository users;
    private final RecruiterProfileRepository recruiters;
    private final ApplicationStatusHistoryRepository history;

    public InterviewService(InterviewRoundRepository interviews, ApplicationRepository applications,
            UserRepository users, RecruiterProfileRepository recruiters,
            ApplicationStatusHistoryRepository history) {
        this.interviews = interviews; this.applications = applications; this.users = users;
        this.recruiters = recruiters; this.history = history;
    }

    public List<InterviewResponse> list(Authentication auth) {
        requireRole(auth, "STUDENT", "RECRUITER", "PLACEMENT_OFFICER", "ADMIN");
        return interviews.findAllByOrderByScheduledAtAsc().stream().filter(i -> canView(i, auth))
            .map(i -> InterviewResponse.from(i, !hasRole(auth, "STUDENT"))).toList();
    }

    public InterviewResponse get(Long id, Authentication auth) {
        InterviewRound interview = getInterview(id); authorizeView(interview, auth);
        return InterviewResponse.from(interview, !hasRole(auth, "STUDENT"));
    }

    @Transactional
    public InterviewResponse create(InterviewRequest request, Authentication auth) {
        requireManager(auth);
        Application app = applications.findById(request.applicationId()).orElseThrow(() -> new IllegalArgumentException("Application not found"));
        authorizeManage(app, auth);
        if (app.getCurrentStatus() != ApplicationStatus.SHORTLISTED && app.getCurrentStatus() != ApplicationStatus.INTERVIEW_SCHEDULED)
            throw new IllegalArgumentException("Application must be shortlisted before an interview can be scheduled");
        validateTime(request.scheduledAt());
        InterviewRound interview = new InterviewRound();
        interview.setApplication(app); apply(interview, request);
        interview.setStatus(InterviewRoundStatus.SCHEDULED); interview.setResult(InterviewResult.PENDING);
        InterviewRound saved = interviews.saveAndFlush(interview);
        if (app.getCurrentStatus() == ApplicationStatus.SHORTLISTED) {
            app.setCurrentStatus(ApplicationStatus.INTERVIEW_SCHEDULED);
            recordStatus(app, ApplicationStatus.SHORTLISTED, ApplicationStatus.INTERVIEW_SCHEDULED, actor(auth));
        }
        return InterviewResponse.from(saved, true);
    }

    @Transactional
    public InterviewResponse update(Long id, InterviewRequest request, Authentication auth) {
        InterviewRound interview = getInterview(id); authorizeManage(interview.getApplication(), auth);
        if (interview.getStatus() == InterviewRoundStatus.CANCELLED || interview.getStatus() == InterviewRoundStatus.COMPLETED)
            throw new IllegalArgumentException("Cancelled or completed interviews cannot be edited");
        if (!request.applicationId().equals(interview.getApplication().getId())) throw new IllegalArgumentException("An interview cannot be moved to another application");
        validateTime(request.scheduledAt());
        boolean changedTime = !request.scheduledAt().equals(interview.getScheduledAt());
        apply(interview, request);
        if (changedTime) interview.setStatus(InterviewRoundStatus.RESCHEDULED);
        return InterviewResponse.from(interview, true);
    }

    @Transactional
    public InterviewResponse updateStatus(Long id, InterviewStatusRequest request, Authentication auth) {
        InterviewRound i = getInterview(id); authorizeManage(i.getApplication(), auth);
        InterviewRoundStatus next = parse(InterviewRoundStatus.values(), request.status(), "interview status");
        InterviewRoundStatus current = i.getStatus();
        boolean valid = switch (current) {
            case SCHEDULED, RESCHEDULED -> next == InterviewRoundStatus.COMPLETED || next == InterviewRoundStatus.RESCHEDULED || next == InterviewRoundStatus.CANCELLED || next == InterviewRoundStatus.NO_SHOW;
            default -> false;
        };
        if (!valid && current != next) throw new IllegalArgumentException("Invalid interview status transition");
        i.setStatus(next);
        if (request.result() != null) {
            if (next != InterviewRoundStatus.COMPLETED) throw new IllegalArgumentException("Interview result can only be set after completion");
            i.setResult(parse(InterviewResult.values(), request.result(), "interview result"));
        }
        if (request.feedback() != null) i.setFeedback(request.feedback());
        return InterviewResponse.from(i, true);
    }

    @Transactional
    public void cancel(Long id, Authentication auth) {
        InterviewRound i = getInterview(id); authorizeManage(i.getApplication(), auth);
        if (i.getStatus() != InterviewRoundStatus.SCHEDULED && i.getStatus() != InterviewRoundStatus.RESCHEDULED)
            throw new IllegalArgumentException("Only scheduled interviews can be cancelled");
        i.setStatus(InterviewRoundStatus.CANCELLED);
    }

    private void apply(InterviewRound i, InterviewRequest r) {
        i.setRoundNumber(r.roundNumber()); i.setRoundName(r.roundName().trim()); i.setScheduledAt(r.scheduledAt());
        i.setDurationMinutes(r.durationMinutes()); i.setInterviewMode(parse(InterviewMode.values(), r.interviewMode(), "interview mode"));
        i.setVenueOrLink(blankToNull(r.venueOrLink())); i.setInterviewerName(blankToNull(r.interviewerName()));
    }
    private void validateTime(Instant time) { if (time == null || !time.isAfter(Instant.now())) throw new IllegalArgumentException("Interview date and time must be in the future"); }
    private String blankToNull(String s) { return s == null || s.isBlank() ? null : s.trim(); }
    private InterviewRound getInterview(Long id) { return interviews.findById(id).orElseThrow(() -> new IllegalArgumentException("Interview not found")); }
    private boolean canView(InterviewRound i, Authentication a) {
        if (hasRole(a, "STUDENT")) return i.getApplication().getStudentProfile().getUser().getId().equals(userId(a));
        if (hasRole(a, "RECRUITER")) return i.getApplication().getJobOpening().getCompany().getId().equals(companyId(a));
        return hasRole(a, "PLACEMENT_OFFICER", "ADMIN");
    }
    private void authorizeView(InterviewRound i, Authentication a) { if (!canView(i, a)) throw denied(); }
    private void authorizeManage(Application app, Authentication a) {
        if (hasRole(a, "RECRUITER")) { if (!app.getJobOpening().getCompany().getId().equals(companyId(a))) throw denied(); }
        else requireRole(a, "PLACEMENT_OFFICER", "ADMIN");
    }
    private void requireManager(Authentication a) { requireRole(a, "RECRUITER", "PLACEMENT_OFFICER", "ADMIN"); }
    private void recordStatus(Application app, ApplicationStatus from, ApplicationStatus to, User by) {
        ApplicationStatusHistory h = new ApplicationStatusHistory(); h.setApplication(app); h.setFromStatus(from); h.setToStatus(to); h.setChangedBy(by); history.save(h);
    }
    private User actor(Authentication a) { return users.findById(userId(a)).orElseThrow(this::denied); }
    private Long userId(Authentication a) { return users.findByEmail(a.getName().toLowerCase(Locale.ROOT)).orElseThrow(this::denied).getId(); }
    private Long companyId(Authentication a) { return recruiters.findByUserId(userId(a)).orElseThrow(this::denied).getCompany().getId(); }
    private void requireRole(Authentication a, String... roles) { if (!hasRole(a, roles)) throw denied(); }
    private boolean hasRole(Authentication a, String... roles) { return a != null && a.getAuthorities().stream().anyMatch(x -> java.util.Arrays.stream(roles).anyMatch(r -> x.getAuthority().equals("ROLE_" + r))); }
    private AccessDeniedException denied() { return new AccessDeniedException("Not authorized to access this interview"); }
    private <E extends Enum<E> & DbEnum> E parse(E[] values, String value, String label) {
        if (value != null) for (E item : values) if (item.getDbValue().equalsIgnoreCase(value.trim()) || item.name().equalsIgnoreCase(value.trim())) return item;
        throw new IllegalArgumentException("Unsupported " + label);
    }
}
