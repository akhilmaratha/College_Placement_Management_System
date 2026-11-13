package com.codeinnov8ors.placement.dto.job;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.List;

import jakarta.validation.constraints.DecimalMax;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PositiveOrZero;
import jakarta.validation.constraints.Size;

public record JobRequest(
		Long companyId,
		Long placementDriveId,
		@NotBlank @Size(max = 150) String title,
		@NotBlank @Size(max = 20000) String description,
		@NotBlank String jobType,
		@NotBlank @Size(max = 100) String location,
		@Size(max = 100) String salaryText,
		@DecimalMin("0.00") BigDecimal minSalary,
		@DecimalMin("0.00") BigDecimal maxSalary,
		@NotNull Instant applicationDeadline,
		@NotNull @DecimalMin("0.00") @DecimalMax("10.00") BigDecimal minCgpa,
		@NotBlank @Size(max = 255) String allowedBranches,
		@PositiveOrZero Integer maxActiveBacklogs,
		Integer batchYear,
		@Size(max = 50) List<@NotBlank @Size(max = 100) String> skills) {}
