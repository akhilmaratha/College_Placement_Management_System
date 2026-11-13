package com.codeinnov8ors.placement.dto.drive;

import jakarta.validation.constraints.NotBlank;

public record DriveStatusRequest(@NotBlank String status) {}
