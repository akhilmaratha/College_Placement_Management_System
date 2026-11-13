package com.codeinnov8ors.placement.dto.application;

import jakarta.validation.constraints.NotBlank;

public record ApplicationStatusRequest(@NotBlank String status) {}
