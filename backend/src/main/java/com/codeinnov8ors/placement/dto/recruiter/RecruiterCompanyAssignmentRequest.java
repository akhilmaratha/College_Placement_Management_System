package com.codeinnov8ors.placement.dto.recruiter;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

public record RecruiterCompanyAssignmentRequest(@NotNull @Positive Long companyId) {}
