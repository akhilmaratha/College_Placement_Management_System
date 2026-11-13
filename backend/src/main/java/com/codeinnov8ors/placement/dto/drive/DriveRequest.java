package com.codeinnov8ors.placement.dto.drive;

import java.time.Instant;
import java.time.LocalDate;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public record DriveRequest(
		@NotBlank @Size(max = 200) String title,
		@NotBlank @Size(max = 20) String academicYear,
		@NotNull LocalDate startDate,
		@NotNull LocalDate endDate,
		@NotNull Instant registrationDeadline,
		@NotBlank String driveMode) {}
