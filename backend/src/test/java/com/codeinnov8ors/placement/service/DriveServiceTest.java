package com.codeinnov8ors.placement.service;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;

import java.time.Instant;
import java.time.LocalDate;
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

import com.codeinnov8ors.placement.dto.drive.DriveRequest;
import com.codeinnov8ors.placement.entity.User;
import com.codeinnov8ors.placement.entity.enums.UserRole;
import com.codeinnov8ors.placement.repository.JobOpeningRepository;
import com.codeinnov8ors.placement.repository.PlacementDriveRepository;
import com.codeinnov8ors.placement.repository.RecruiterProfileRepository;
import com.codeinnov8ors.placement.repository.UserRepository;

@ExtendWith(MockitoExtension.class)
class DriveServiceTest {
	@Mock PlacementDriveRepository drives; @Mock JobOpeningRepository jobs; @Mock UserRepository users; @Mock RecruiterProfileRepository recruiters;
	DriveService service; User officer;
	@BeforeEach void init() { service = new DriveService(drives, jobs, users, recruiters); officer = new User(); officer.setId(2L); officer.setEmail("officer@example.edu"); officer.setRole(UserRole.PLACEMENT_OFFICER); }
	@Test void placementOfficerCreatesUpcomingDrive() {
		when(users.findByEmail("officer@example.edu")).thenReturn(Optional.of(officer));
		when(drives.save(any())).thenAnswer(inv -> inv.getArgument(0));
		var response = service.create(new DriveRequest("Campus Hiring", "2027", LocalDate.parse("2027-01-10"), LocalDate.parse("2027-01-11"), Instant.parse("2027-01-09T18:30:00Z"), "On-Campus"), auth("officer@example.edu", "ROLE_PLACEMENT_OFFICER"));
		assertEquals("Upcoming", response.status()); assertEquals("On-Campus", response.driveMode());
	}
	@Test void recruiterCannotCreateUnownedDrive() {
		assertThrows(AccessDeniedException.class, () -> service.create(new DriveRequest("Campus Hiring", "2027", LocalDate.parse("2027-01-10"), LocalDate.parse("2027-01-11"), Instant.now(), "On-Campus"), auth("r@example.com", "ROLE_RECRUITER")));
	}
	private UsernamePasswordAuthenticationToken auth(String email, String role) { return new UsernamePasswordAuthenticationToken(email, "", List.of(new SimpleGrantedAuthority(role))); }
}
