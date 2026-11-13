package com.codeinnov8ors.placement.service;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

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
import com.codeinnov8ors.placement.entity.*;
import com.codeinnov8ors.placement.entity.enums.*;
import com.codeinnov8ors.placement.repository.*;

@ExtendWith(MockitoExtension.class)
class DashboardServiceTest {
    @Mock UserRepository users; @Mock StudentProfileRepository students; @Mock CompanyRepository companies;
    @Mock RecruiterProfileRepository recruiters; @Mock JobOpeningRepository jobs; @Mock PlacementDriveRepository drives;
    @Mock ApplicationRepository applications; @Mock InterviewRoundRepository interviews;
    DashboardService service;
    @BeforeEach void init(){service=new DashboardService(users,students,companies,recruiters,jobs,drives,applications,interviews);}

    @Test void studentDashboardCountsOnlyAuthenticatedStudentsApplications(){
        var auth=auth("s@example.edu","ROLE_STUDENT"); User user=new User();user.setId(12L);user.setEmail("s@example.edu");
        StudentProfile profile=new StudentProfile();profile.setId(9L);profile.setUser(user);profile.setProfileComplete(true);
        when(users.findByEmail("s@example.edu")).thenReturn(Optional.of(user));when(students.findByUserId(12L)).thenReturn(Optional.of(profile));
        when(applications.countByStudentProfileId(9L)).thenReturn(3L);
        when(applications.countByStudentProfileIdAndCurrentStatus(9L,ApplicationStatus.APPLIED)).thenReturn(1L);
        when(applications.countByStudentProfileIdAndCurrentStatus(9L,ApplicationStatus.SHORTLISTED)).thenReturn(1L);
        when(applications.countByStudentProfileIdAndCurrentStatus(9L,ApplicationStatus.INTERVIEW_SCHEDULED)).thenReturn(0L);
        when(applications.countByStudentProfileIdAndCurrentStatus(9L,ApplicationStatus.SELECTED)).thenReturn(1L);
        when(interviews.countByApplicationStudentProfileIdAndScheduledAtAfterAndStatusIn(eq(9L),any(),anyList())).thenReturn(2L);
        when(applications.findTop5ByStudentProfileIdOrderByAppliedAtDesc(9L)).thenReturn(List.of());
        when(interviews.findTop5ByApplicationStudentProfileIdAndScheduledAtAfterAndStatusInOrderByScheduledAtAsc(eq(9L),any(),anyList())).thenReturn(List.of());
        when(jobs.countByStatusAndApplicationDeadlineAfter(eq(JobOpeningStatus.PUBLISHED),any())).thenReturn(5L);
        when(jobs.findTop5ByStatusAndApplicationDeadlineAfterOrderByApplicationDeadlineAsc(eq(JobOpeningStatus.PUBLISHED),any())).thenReturn(List.of());
        var result=service.student(auth);
        assertEquals(3,result.summary().totalApplications());assertEquals(2,result.summary().applicationsUnderReview());assertEquals(1,result.summary().shortlistedApplications());assertEquals(5,result.summary().availableJobs());assertTrue(result.profileComplete());
        verify(applications).countByStudentProfileId(9L);verify(applications,never()).countByCurrentStatus(any());
    }

    @Test void recruiterUsesOnlyTheirAssignedCompany(){
        var auth=auth("r@example.com","ROLE_RECRUITER");User user=new User();user.setId(3L);user.setEmail("r@example.com");
        Company company=new Company();company.setId(44L);company.setName("Allowed Co");RecruiterProfile profile=new RecruiterProfile();profile.setCompany(company);profile.setUser(user);
        when(users.findByEmail("r@example.com")).thenReturn(Optional.of(user));when(recruiters.findByUserId(3L)).thenReturn(Optional.of(profile));
        when(jobs.findTop5ByCompanyIdOrderByUpdatedAtDesc(44L)).thenReturn(List.of());when(applications.findTop5ByJobOpeningCompanyIdOrderByAppliedAtDesc(44L)).thenReturn(List.of());
        when(interviews.findTop5ByApplicationJobOpeningCompanyIdAndScheduledAtAfterAndStatusInOrderByScheduledAtAsc(eq(44L),any(),anyList())).thenReturn(List.of());
        when(applications.countByJobOpeningCompanyIdAndCurrentStatus(eq(44L),any())).thenReturn(0L);
        when(jobs.countByCompanyId(44L)).thenReturn(2L);when(jobs.countByCompanyIdAndStatusAndApplicationDeadlineAfter(eq(44L),eq(JobOpeningStatus.PUBLISHED),any())).thenReturn(1L);when(jobs.countByCompanyIdAndStatus(44L,JobOpeningStatus.CLOSED)).thenReturn(1L);
        when(applications.countByJobOpeningCompanyId(44L)).thenReturn(4L);when(interviews.countByApplicationJobOpeningCompanyIdAndScheduledAtAfterAndStatusIn(eq(44L),any(),anyList())).thenReturn(1L);
        var result=service.recruiter(auth);
        assertEquals("Allowed Co",result.companyName());assertEquals(4,result.summary().totalApplications());
        verify(applications).countByJobOpeningCompanyId(44L);verify(applications,never()).countByCurrentStatus(any());
    }

    @Test void studentCannotRequestAdminDashboard(){assertThrows(AccessDeniedException.class,()->service.admin(auth("s@example.edu","ROLE_STUDENT")));}
    private UsernamePasswordAuthenticationToken auth(String email,String role){return new UsernamePasswordAuthenticationToken(email,"",List.of(new SimpleGrantedAuthority(role)));}
}
