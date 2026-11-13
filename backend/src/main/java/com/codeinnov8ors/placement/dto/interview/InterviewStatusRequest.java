package com.codeinnov8ors.placement.dto.interview;

import jakarta.validation.constraints.NotBlank;

public record InterviewStatusRequest(@NotBlank String status, String result, String feedback) {}
