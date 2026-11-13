package com.codeinnov8ors.placement.dto.company;

import com.codeinnov8ors.placement.entity.enums.CompanyVerificationStatus;
import jakarta.validation.constraints.NotNull;

public record CompanyStatusRequest(@NotNull CompanyVerificationStatus verificationStatus) {}
