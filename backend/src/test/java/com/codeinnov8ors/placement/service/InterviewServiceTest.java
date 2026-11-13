package com.codeinnov8ors.placement.service;

import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.when;

import java.util.List;
import java.util.Optional;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;

import com.codeinnov8ors.placement.dto.interview.InterviewRequest;
import com.codeinnov8ors.placement.entity.*;
import com.codeinnov8ors.placement.entity.enums.ApplicationStatus;
import com.codeinnov8ors.placement.repository.*;

@ExtendWith(MockitoExtension.class)
class InterviewServiceTest {
    @Mock InterviewRoundRepository interviews;
    @Mock ApplicationRepository applications;
    @Mock UserRepository users;
    @Mock RecruiterProfileRepository recruiters;
    @Mock ApplicationStatusHistoryRepository history;
    InterviewService service;

    @BeforeEach void init() { service = new InterviewService(interviews, applications, users, recruiters, history); }

    @Test void recruiterCannotScheduleForAnotherCompany() {
        var auth = auth("recruiter@example.com", "ROLE_RECRUITER");
        User user = new User(); user.setId(9L); user.setEmail("recruiter@example.com");
        Company mine = new Company(); mine.setId(1L);
        RecruiterProfile profile = new RecruiterProfile(); profile.setCompany(mine);
        Company other = new Company(); other.setId(2L);
        JobOpening job = new JobOpening(); job.setCompany(other);
        Application app = new Application(); app.setId(3L); app.setJobOpening(job); app.setCurrentStatus(ApplicationStatus.SHORTLISTED);
        when(users.findByEmail("recruiter@example.com")).thenReturn(Optional.of(user));
        when(recruiters.findByUserId(9L)).thenReturn(Optional.of(profile));
        when(applications.findById(3L)).thenReturn(Optional.of(app));
        assertThrows(AccessDeniedException.class, () -> service.create(request(3L), auth));
    }

    @Test void interviewRequiresShortlistedApplication() {
        var auth = auth("officer@example.com", "ROLE_PLACEMENT_OFFICER");
        Application app = new Application(); app.setId(3L); app.setCurrentStatus(ApplicationStatus.APPLIED);
        when(applications.findById(3L)).thenReturn(Optional.of(app));
        assertThrows(IllegalArgumentException.class, () -> service.create(request(3L), auth));
    }

    @Test void studentGetsOnlyOwnInterviewsAndNoRecruiterFeedback() {
        var auth = auth("student@example.edu", "ROLE_STUDENT");
        User me = new User(); me.setId(5L); me.setEmail("student@example.edu");
        User other = new User(); other.setId(6L); other.setEmail("other@example.edu");
        when(users.findByEmail("student@example.edu")).thenReturn(Optional.of(me));
        Application own = applicationForStudent(11L, me); own.setId(21L);
        Application theirs = applicationForStudent(12L, other); theirs.setId(22L);
        var ownInterview = interview(own); var otherInterview = interview(theirs);
        when(interviews.findAllByOrderByScheduledAtAsc()).thenReturn(List.of(ownInterview, otherInterview));
        var result = service.list(auth);
        assertEquals(1, result.size());
        assertEquals(21L, result.getFirst().applicationId());
        assertEquals(null, result.getFirst().feedback());
    }

    private InterviewRequest request(Long id) { return new InterviewRequest(id, 1, "Technical", java.time.Instant.now().plusSeconds(3600), 45, "Video Call", "https://meet.example.com", "Interviewer"); }
    private Application applicationForStudent(Long profileId, User user) {
        StudentProfile student = new StudentProfile(); student.setId(profileId); student.setUser(user);
        Company company = new Company(); company.setId(2L); company.setName("Example Company");
        JobOpening job = new JobOpening(); job.setId(4L); job.setTitle("Engineer"); job.setCompany(company);
        Application app = new Application(); app.setStudentProfile(student); app.setJobOpening(job); return app;
    }
    private InterviewRound interview(Application application) {
        InterviewRound i = new InterviewRound(); i.setApplication(application); i.setRoundNumber(1); i.setRoundName("Technical");
        i.setScheduledAt(java.time.Instant.now().plusSeconds(1800)); i.setDurationMinutes(45);
        i.setInterviewMode(com.codeinnov8ors.placement.entity.enums.InterviewMode.VIDEO_CALL);
        i.setStatus(com.codeinnov8ors.placement.entity.enums.InterviewRoundStatus.SCHEDULED);
        i.setResult(com.codeinnov8ors.placement.entity.enums.InterviewResult.PENDING); i.setFeedback("Private recruiter feedback"); return i;
    }
    private UsernamePasswordAuthenticationToken auth(String email, String role) {
        return new UsernamePasswordAuthenticationToken(email, "", List.of(new SimpleGrantedAuthority(role)));
    }
}
