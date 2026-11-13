package com.codeinnov8ors.placement.dto.job;

import jakarta.validation.constraints.NotBlank;

public record JobStatusRequest(@NotBlank String status) {}
