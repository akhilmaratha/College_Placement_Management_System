package com.codeinnov8ors.placement.service;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNull;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.Mockito.verify;
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

import com.codeinnov8ors.placement.dto.student.StudentProfileUpdateRequest;
import com.codeinnov8ors.placement.entity.StudentProfile;
import com.codeinnov8ors.placement.entity.User;
import com.codeinnov8ors.placement.entity.enums.UserRole;
import com.codeinnov8ors.placement.repository.AcademicRecordRepository;
import com.codeinnov8ors.placement.repository.ResumeRepository;
import com.codeinnov8ors.placement.repository.StudentProfileRepository;
import com.codeinnov8ors.placement.repository.StudentSkillRepository;
import com.codeinnov8ors.placement.repository.UserRepository;

@ExtendWith(MockitoExtension.class)
class StudentServiceTest {
	@Mock StudentProfileRepository students;
	@Mock UserRepository users;
	@Mock AcademicRecordRepository academics;
	@Mock StudentSkillRepository skills;
	@Mock ResumeRepository resumes;
	StudentService service;
	User user;
	StudentProfile profile;

	@BeforeEach void setUp() {
		service = new StudentService(students, users, academics, skills, resumes);
		user = new User(); user.setId(5L); user.setEmail("student@example.edu"); user.setRole(UserRole.STUDENT);
		profile = new StudentProfile(); profile.setId(42L); profile.setUser(user); profile.setRollNumber("R-42");
		profile.setFullName("Student Name"); profile.setPhoneNumber("9876543210");
	}

	@Test void studentCanUpdateOwnPermittedFields() {
		var auth = auth("student@example.edu", "ROLE_STUDENT");
		when(users.findByEmail("student@example.edu")).thenReturn(Optional.of(user));
		when(students.findByUserId(5L)).thenReturn(Optional.of(profile));
		when(academics.findByStudentProfileId(42L)).thenReturn(Optional.empty());
		when(skills.findByStudentProfileId(42L)).thenReturn(List.of());
		when(resumes.findByStudentProfileId(42L)).thenReturn(List.of());

		var response = service.updateMe(auth, new StudentProfileUpdateRequest("Updated Name", "+1 555 555 5555", null, "Other", null, null, null, null));

		assertEquals("Updated Name", response.fullName());
		assertEquals("R-42", response.rollNumber());
		verify(students).findByUserId(5L);
	}

	@Test void studentCannotReadAnotherStudentsProfile() {
		var auth = auth("student@example.edu", "ROLE_STUDENT");
		when(users.findByEmail("student@example.edu")).thenReturn(Optional.of(user));
		User anotherUser = new User(); anotherUser.setId(8L); anotherUser.setEmail("other@example.edu");
		StudentProfile anotherProfile = new StudentProfile(); anotherProfile.setId(99L); anotherProfile.setUser(anotherUser);
		when(students.findById(99L)).thenReturn(Optional.of(anotherProfile));

		assertThrows(AccessDeniedException.class, () -> service.byId(99L, auth));
	}

	@Test void recruiterResponseOmitsContactAndEnrollmentFields() {
		var auth = auth("recruiter@example.com", "ROLE_RECRUITER");
		when(students.findById(42L)).thenReturn(Optional.of(profile));
		when(academics.findByStudentProfileId(42L)).thenReturn(Optional.empty());
		when(skills.findByStudentProfileId(42L)).thenReturn(List.of());
		when(resumes.findByStudentProfileId(42L)).thenReturn(List.of());

		var response = service.byId(42L, auth);

		assertEquals("Student Name", response.fullName());
		assertNull(response.email());
		assertNull(response.rollNumber());
		assertNull(response.phoneNumber());
	}

	private UsernamePasswordAuthenticationToken auth(String email, String authority) {
		return new UsernamePasswordAuthenticationToken(email, "", List.of(new SimpleGrantedAuthority(authority)));
	}
}
