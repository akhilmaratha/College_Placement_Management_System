package com.codeinnov8ors.placement.service;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.when;

import java.util.List;
import java.util.Optional;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;

import com.codeinnov8ors.placement.dto.recruiter.RecruiterProfileUpdateRequest;
import com.codeinnov8ors.placement.dto.recruiter.RecruiterCompanyAssignmentRequest;
import com.codeinnov8ors.placement.entity.Company;
import com.codeinnov8ors.placement.entity.RecruiterProfile;
import com.codeinnov8ors.placement.entity.User;
import com.codeinnov8ors.placement.entity.enums.UserRole;
import com.codeinnov8ors.placement.repository.RecruiterProfileRepository;
import com.codeinnov8ors.placement.repository.UserRepository;
import com.codeinnov8ors.placement.repository.CompanyRepository;

@ExtendWith(MockitoExtension.class)
class RecruiterServiceTest {
	@Mock RecruiterProfileRepository recruiters;
	@Mock UserRepository users;
	@Mock CompanyRepository companies;
	RecruiterService service;
	User user;
	RecruiterProfile profile;
	Company company;

	@BeforeEach void setUp() {
		service = new RecruiterService(recruiters, users, companies);
		user = new User(); user.setId(4L); user.setEmail("recruiter@example.com"); user.setRole(UserRole.RECRUITER);
		company = new Company(); company.setId(8L); company.setName("Acme");
		profile = new RecruiterProfile(); profile.setId(12L); profile.setUser(user); profile.setCompany(company); profile.setDesignation("Talent Lead");
	}

	@Test void recruiterCanUpdateOwnContactFieldsButCannotMoveCompany() {
		when(users.findByEmail("recruiter@example.com")).thenReturn(Optional.of(user));
		when(recruiters.findByUserId(4L)).thenReturn(Optional.of(profile));
		var auth = new UsernamePasswordAuthenticationToken("recruiter@example.com", "", List.of(new SimpleGrantedAuthority("ROLE_RECRUITER")));
		var response = service.updateMe(auth, new RecruiterProfileUpdateRequest("Recruitment Manager", "+1 555 555 5555"));
		assertEquals("Recruitment Manager", response.designation());
		assertEquals(8L, response.companyId());
	}

	@Test void placementOfficerCanReassignExistingRecruiterToExistingCompany() {
		User officer = new User(); officer.setId(2L); officer.setEmail("officer@example.edu");
		Company newCompany = new Company(); newCompany.setId(9L); newCompany.setName("New Company");
		when(recruiters.findById(12L)).thenReturn(Optional.of(profile));
		when(companies.findById(9L)).thenReturn(Optional.of(newCompany));
		var auth = new UsernamePasswordAuthenticationToken("officer@example.edu", "", List.of(new SimpleGrantedAuthority("ROLE_PLACEMENT_OFFICER")));

		var response = service.assignCompany(12L, new RecruiterCompanyAssignmentRequest(9L), auth);

		assertEquals(9L, response.companyId());
		assertEquals("New Company", response.companyName());
	}
}
