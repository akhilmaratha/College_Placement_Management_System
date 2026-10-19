package com.codeinnov8ors.placement.repository;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;

import java.math.BigDecimal;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.data.jpa.test.autoconfigure.DataJpaTest;
import org.springframework.test.context.ActiveProfiles;

import com.codeinnov8ors.placement.entity.AcademicRecord;
import com.codeinnov8ors.placement.entity.StudentProfile;
import com.codeinnov8ors.placement.entity.User;
import com.codeinnov8ors.placement.entity.enums.AcademicVerificationStatus;
import com.codeinnov8ors.placement.entity.enums.UserRole;
import com.codeinnov8ors.placement.entity.enums.UserStatus;

@DataJpaTest
@ActiveProfiles("datajpa")
class StudentProfileRelationshipTest {

	@Autowired
	private UserRepository userRepository;

	@Autowired
	private StudentProfileRepository studentProfileRepository;

	@Autowired
	private AcademicRecordRepository academicRecordRepository;

	@Test
	void persistsOneToOneStudentProfileAndAcademicRecord() {
		User user = new User();
		user.setEmail("ada@college.edu");
		user.setPasswordHash("$2a$10$placeholderhashvalueforpersistencetest");
		user.setRole(UserRole.STUDENT);
		user.setStatus(UserStatus.ACTIVE);
		user = userRepository.saveAndFlush(user);

		StudentProfile profile = new StudentProfile();
		profile.setUser(user);
		profile.setRollNumber("CSE2026-001");
		profile.setFullName("Ada Lovelace");
		profile.setPhoneNumber("+910000000001");
		// gender left null (allowed by schema). Converted enum CHECK values are covered by SchemaEnumConsistencyTest;
		// H2 create-drop enum checks are not identical to PostgreSQL VARCHAR CHECKs.
		profile.setProfileComplete(false);
		profile = studentProfileRepository.saveAndFlush(profile);

		AcademicRecord record = new AcademicRecord();
		record.setStudentProfile(profile);
		record.setDegreeProgram("B.Tech");
		record.setDepartmentBranch("CSE");
		record.setGraduationYear(2026);
		record.setCurrentCgpa(new BigDecimal("8.75"));
		record.setVerificationStatus(AcademicVerificationStatus.PENDING);
		record = academicRecordRepository.saveAndFlush(record);

		assertEquals(profile.getId(),
				studentProfileRepository.findByRollNumber("CSE2026-001").orElseThrow().getId());
		assertEquals(new BigDecimal("8.75"),
				academicRecordRepository.findByStudentProfileId(profile.getId()).orElseThrow().getCurrentCgpa());
		assertTrue(record.getId() != null);
	}
}
