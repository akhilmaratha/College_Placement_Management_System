package com.codeinnov8ors.placement.dto.student;

import java.time.LocalDate;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

public record StudentProfileUpdateRequest(
		@NotBlank @Size(max = 150) String fullName,
		@NotBlank @Pattern(regexp = "^[+]?[0-9 ()-]{7,20}$", message = "must be a valid phone number") String phoneNumber,
		@Email @Size(max = 255) String alternateEmail,
		@Size(max = 20) String gender,
		LocalDate dateOfBirth,
		@Size(max = 10000) String currentAddress,
		@Size(max = 255) String linkedinUrl,
		@Size(max = 255) String githubUrl) {}
