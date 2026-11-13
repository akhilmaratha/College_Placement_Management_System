package com.codeinnov8ors.placement.dto.student;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

public record StudentProfileResponse(Long id, String fullName, String email, String rollNumber, String phoneNumber,
		String alternateEmail, String gender, LocalDate dateOfBirth, String currentAddress, String linkedinUrl,
		String githubUrl, String degreeProgram, String departmentBranch, Integer graduationYear, BigDecimal currentCgpa,
		List<String> skills, List<ResumeInfo> resumes, boolean profileComplete) {
	public record ResumeInfo(Long id, String title, String originalFileName, Long fileSizeBytes, String mimeType,
			boolean defaultResume) {}
}
