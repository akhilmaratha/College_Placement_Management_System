package com.codeinnov8ors.placement.entity.enums;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;

import java.util.Arrays;
import java.util.Set;
import java.util.stream.Collectors;

import org.junit.jupiter.api.Test;

/**
 * Guards CHECK-constraint string values from database/schema.sql against Java enums.
 */
class SchemaEnumConsistencyTest {

	@Test
	void userRoleMatchesSchemaCheck() {
		assertEnumNames(UserRole.class, "STUDENT", "RECRUITER", "PLACEMENT_OFFICER", "ADMIN");
	}

	@Test
	void userStatusMatchesSchemaCheck() {
		assertEnumNames(UserStatus.class, "ACTIVE", "INACTIVE", "LOCKED", "PENDING_VERIFICATION");
	}

	@Test
	void academicVerificationStatusMatchesSchemaCheck() {
		assertEnumNames(AcademicVerificationStatus.class, "PENDING", "VERIFIED", "REJECTED");
	}

	@Test
	void companyVerificationStatusMatchesSchemaCheck() {
		assertEnumNames(CompanyVerificationStatus.class, "PENDING", "VERIFIED", "BLOCKED");
	}

	@Test
	void genderDbValuesMatchSchemaCheck() {
		assertDbValues(Gender.class, "Male", "Female", "Other", "Prefer not to say");
	}

	@Test
	void proficiencyDbValuesMatchSchemaCheck() {
		assertDbValues(ProficiencyLevel.class, "Beginner", "Intermediate", "Advanced");
	}

	@Test
	void driveModeDbValuesMatchSchemaCheck() {
		assertDbValues(DriveMode.class, "On-Campus", "Virtual", "Pooled");
	}

	@Test
	void driveStatusDbValuesMatchSchemaCheck() {
		assertDbValues(DriveStatus.class, "Upcoming", "Open", "In Progress", "Closed");
	}

	@Test
	void jobTypeDbValuesMatchSchemaCheck() {
		assertDbValues(JobType.class, "Full-time", "Internship", "Contract");
	}

	@Test
	void jobOpeningStatusDbValuesMatchSchemaCheck() {
		assertDbValues(JobOpeningStatus.class, "Draft", "Published", "Closed");
	}

	@Test
	void applicationStatusDbValuesMatchSchemaCheck() {
		assertDbValues(ApplicationStatus.class, "Applied", "Shortlisted", "Interview Scheduled", "Selected",
				"Rejected");
	}

	@Test
	void interviewModeDbValuesMatchSchemaCheck() {
		assertDbValues(InterviewMode.class, "In-Person", "Video Call", "Phone");
	}

	@Test
	void interviewRoundStatusDbValuesMatchSchemaCheck() {
		assertDbValues(InterviewRoundStatus.class, "Scheduled", "Completed", "Rescheduled", "Cancelled", "No Show");
	}

	@Test
	void interviewResultDbValuesMatchSchemaCheck() {
		assertDbValues(InterviewResult.class, "Pending", "Cleared", "Not Cleared", "On Hold");
	}

	@Test
	void studentResponseDbValuesMatchSchemaCheck() {
		assertDbValues(StudentResponse.class, "Pending", "Accepted", "Declined", "Revoked");
	}

	@Test
	void convertersRoundTripSampleValues() {
		assertEquals(Gender.PREFER_NOT_TO_SAY, new Gender.ConverterImpl().convertToEntityAttribute("Prefer not to say"));
		assertEquals("Interview Scheduled",
				new ApplicationStatus.ConverterImpl().convertToDatabaseColumn(ApplicationStatus.INTERVIEW_SCHEDULED));
		assertEquals(DriveStatus.IN_PROGRESS, new DriveStatus.ConverterImpl().convertToEntityAttribute("In Progress"));
	}

	private static void assertEnumNames(Class<? extends Enum<?>> type, String... expected) {
		Set<String> actual = Arrays.stream(type.getEnumConstants()).map(Enum::name).collect(Collectors.toSet());
		Set<String> expectedSet = Set.of(expected);
		assertEquals(expectedSet, actual);
	}

	private static <E extends Enum<E> & DbEnum> void assertDbValues(Class<E> type, String... expected) {
		Set<String> actual = Arrays.stream(type.getEnumConstants()).map(DbEnum::getDbValue).collect(Collectors.toSet());
		Set<String> expectedSet = Set.of(expected);
		assertEquals(expectedSet.size(), actual.size());
		for (String value : expected) {
			assertTrue(actual.contains(value), () -> "Missing DB value: " + value);
		}
	}
}
