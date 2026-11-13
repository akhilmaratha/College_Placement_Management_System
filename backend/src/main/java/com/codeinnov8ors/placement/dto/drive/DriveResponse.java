package com.codeinnov8ors.placement.dto.drive;

import java.time.Instant;
import java.time.LocalDate;

import com.codeinnov8ors.placement.entity.PlacementDrive;

public record DriveResponse(Long id, String title, String academicYear, LocalDate startDate, LocalDate endDate,
		Instant registrationDeadline, String driveMode, String status) {
	public static DriveResponse from(PlacementDrive d) {
		return new DriveResponse(d.getId(), d.getTitle(), d.getAcademicYear(), d.getStartDate(), d.getEndDate(),
			 d.getRegistrationDeadline(), d.getDriveMode().getDbValue(), d.getStatus().getDbValue());
	}
}
