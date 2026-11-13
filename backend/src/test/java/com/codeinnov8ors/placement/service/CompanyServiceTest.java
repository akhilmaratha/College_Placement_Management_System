package com.codeinnov8ors.placement.service;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNull;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;

import java.util.List;
import java.util.Optional;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.PageRequest;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;

import com.codeinnov8ors.placement.dto.company.CompanyRequest;
import com.codeinnov8ors.placement.entity.Company;
import com.codeinnov8ors.placement.entity.RecruiterProfile;
import com.codeinnov8ors.placement.entity.User;
import com.codeinnov8ors.placement.entity.enums.CompanyVerificationStatus;
import com.codeinnov8ors.placement.entity.enums.UserRole;
import com.codeinnov8ors.placement.repository.CompanyRepository;
import com.codeinnov8ors.placement.repository.RecruiterProfileRepository;
import com.codeinnov8ors.placement.repository.UserRepository;

@ExtendWith(MockitoExtension.class)
class CompanyServiceTest {
	@Mock CompanyRepository companies;
	@Mock RecruiterProfileRepository recruiters;
	@Mock UserRepository users;
	CompanyService service;
	User recruiterUser;
	Company ownCompany;
	CompanyRequest request;

	@BeforeEach void setUp() {
		service = new CompanyService(companies, recruiters, users);
		recruiterUser = new User(); recruiterUser.setId(7L); recruiterUser.setEmail("recruiter@example.com"); recruiterUser.setRole(UserRole.RECRUITER);
		ownCompany = company(11L, "My Company", CompanyVerificationStatus.VERIFIED);
		request = new CompanyRequest("Other Company", "https://other.example", "Software", "Pune", "Company description", "contact@other.example", "+91 1234567890", null);
	}

	@Test void placementOfficerCreatesCompanyPendingApproval() {
		var auth = auth("officer@example.edu", "ROLE_PLACEMENT_OFFICER");
		when(companies.existsByName("Other Company")).thenReturn(false);
		when(companies.save(any(Company.class))).thenAnswer(inv -> inv.getArgument(0));

		var response = service.create(request, auth);

		assertEquals(CompanyVerificationStatus.PENDING, response.verificationStatus());
		assertEquals("Other Company", response.name());
	}

	@Test void recruiterCannotUpdateDifferentCompany() {
		var auth = auth("recruiter@example.com", "ROLE_RECRUITER");
		when(companies.findById(22L)).thenReturn(Optional.of(company(22L, "Private Company", CompanyVerificationStatus.PENDING)));
		when(users.findByEmail("recruiter@example.com")).thenReturn(Optional.of(recruiterUser));
		RecruiterProfile own = new RecruiterProfile(); own.setCompany(ownCompany);
		when(recruiters.findByUserId(7L)).thenReturn(Optional.of(own));

		assertThrows(AccessDeniedException.class, () -> service.update(22L, request, auth));
	}

	@Test void studentsReceiveOnlyVerifiedCompanyDetailsWithoutContacts() {
		var auth = auth("student@example.edu", "ROLE_STUDENT");
		when(companies.findById(11L)).thenReturn(Optional.of(ownCompany));

		var response = service.get(11L, auth);

		assertEquals("My Company", response.name());
		assertNull(response.contactEmail());
		assertNull(response.contactPhone());
	}

	@Test void studentsCannotViewUnverifiedCompanies() {
		var auth = auth("student@example.edu", "ROLE_STUDENT");
		when(companies.findById(12L)).thenReturn(Optional.of(company(12L, "Pending Co", CompanyVerificationStatus.PENDING)));
		assertThrows(AccessDeniedException.class, () -> service.get(12L, auth));
	}

	private Company company(Long id, String name, CompanyVerificationStatus status) {
		Company c = new Company(); c.setId(id); c.setName(name); c.setIndustrySector("Software"); c.setLocation("Pune");
		c.setContactEmail("contact@example.com"); c.setContactPhone("1234567890"); c.setVerificationStatus(status); return c;
	}
	private UsernamePasswordAuthenticationToken auth(String email, String role) {
		return new UsernamePasswordAuthenticationToken(email, "", List.of(new SimpleGrantedAuthority(role)));
	}
}
