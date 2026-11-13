package com.codeinnov8ors.placement.dto.interview;

import java.time.Instant;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public record InterviewRequest(
        @NotNull Long applicationId,
        @Min(1) int roundNumber,
        @NotBlank @Size(max = 100) String roundName,
        @NotNull Instant scheduledAt,
        @Min(1) int durationMinutes,
        @NotBlank String interviewMode,
        @Size(max = 500) String venueOrLink,
        @Size(max = 150) String interviewerName) {}
