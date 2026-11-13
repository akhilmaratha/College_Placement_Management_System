package com.codeinnov8ors.placement.service;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.math.BigDecimal;
import java.time.Instant;
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

import com.codeinnov8ors.placement.dto.job.JobRequest;
import com.codeinnov8ors.placement.entity.Company;
import com.codeinnov8ors.placement.entity.JobOpening;
import com.codeinnov8ors.placement.entity.RecruiterProfile;
import com.codeinnov8ors.placement.entity.User;
import com.codeinnov8ors.placement.entity.enums.CompanyVerificationStatus;
import com.codeinnov8ors.placement.entity.enums.JobOpeningStatus;
import com.codeinnov8ors.placement.entity.enums.UserRole;
import com.codeinnov8ors.placement.repository.CompanyRepository;
import com.codeinnov8ors.placement.repository.JobOpeningRepository;
import com.codeinnov8ors.placement.repository.JobSkillRepository;
import com.codeinnov8ors.placement.repository.PlacementDriveRepository;
import com.codeinnov8ors.placement.repository.RecruiterProfileRepository;
import com.codeinnov8ors.placement.repository.SkillRepository;
import com.codeinnov8ors.placement.repository.UserRepository;

@ExtendWith(MockitoExtension.class)
class JobServiceTest {
	@Mock JobOpeningRepository jobs; @Mock CompanyRepository companies; @Mock PlacementDriveRepository drives;
	@Mock RecruiterProfileRepository recruiters; @Mock UserRepository users; @Mock SkillRepository skills; @Mock JobSkillRepository jobSkills;
	JobService service; User user; Company own; JobRequest request;
	@BeforeEach void init() {
		service = new JobService(jobs, companies, drives, recruiters, users, skills, jobSkills);
		user = new User(); user.setId(4L); user.setEmail("r@example.com"); user.setRole(UserRole.RECRUITER);
		own = company(10L, CompanyVerificationStatus.VERIFIED);
		request = new JobRequest(10L, null, "Engineer", "Role description", "Full-time", "Pune", "", null, null,
			Instant.now().plusSeconds(86400), BigDecimal.ZERO, "CSE", 0, 2027, List.of());
	}
	@Test void recruiterCreatesJobForOwnCompany() {
		var auth = auth("r@example.com", "ROLE_RECRUITER");
		when(users.findByEmail("r@example.com")).thenReturn(Optional.of(user));
		RecruiterProfile rp = new RecruiterProfile(); rp.setCompany(own); when(recruiters.findByUserId(4L)).thenReturn(Optional.of(rp));
		when(companies.findById(10L)).thenReturn(Optional.of(own));
		when(jobs.save(any(JobOpening.class))).thenAnswer(inv -> { JobOpening j = inv.getArgument(0); j.setId(77L); return j; });
		when(jobSkills.findByJobOpeningId(77L)).thenReturn(List.of());

		var response = service.create(request, auth);

		assertEquals(10L, response.companyId()); assertEquals("Draft", response.status());
		verify(jobSkills).deleteByJobOpeningId(77L);
	}
	@Test void recruiterCannotCreateJobForAnotherCompany() {
		var auth = auth("r@example.com", "ROLE_RECRUITER");
		when(users.findByEmail("r@example.com")).thenReturn(Optional.of(user));
		RecruiterProfile rp = new RecruiterProfile(); rp.setCompany(own); when(recruiters.findByUserId(4L)).thenReturn(Optional.of(rp));
		assertThrows(AccessDeniedException.class, () -> service.create(new JobRequest(11L, null, "Engineer", "Role description", "Full-time", "Pune", null, null, null, Instant.now().plusSeconds(86400), BigDecimal.ZERO, "CSE", 0, 2027, List.of()), auth));
	}
	@Test void studentCannotReadDraftJob() {
		JobOpening job = new JobOpening(); job.setId(5L); job.setCompany(own); job.setStatus(JobOpeningStatus.DRAFT); job.setApplicationDeadline(Instant.now().plusSeconds(86400));
		when(jobs.findById(5L)).thenReturn(Optional.of(job));
		assertThrows(AccessDeniedException.class, () -> service.get(5L, auth("s@example.edu", "ROLE_STUDENT")));
	}
	private Company company(Long id, CompanyVerificationStatus status) { Company c = new Company(); c.setId(id); c.setName("Company"); c.setVerificationStatus(status); return c; }
	private UsernamePasswordAuthenticationToken auth(String email, String role) { return new UsernamePasswordAuthenticationToken(email, "", List.of(new SimpleGrantedAuthority(role))); }
}
