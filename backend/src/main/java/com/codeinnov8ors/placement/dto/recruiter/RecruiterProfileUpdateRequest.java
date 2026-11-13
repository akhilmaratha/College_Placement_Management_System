package com.codeinnov8ors.placement.dto.recruiter;

import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

public record RecruiterProfileUpdateRequest(
		@Size(max = 100) String designation,
		@Pattern(regexp = "^$|[+]?[0-9 ()-]{7,20}$", message = "must be a valid phone number") String phoneNumber) {}
