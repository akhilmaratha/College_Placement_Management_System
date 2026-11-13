package com.codeinnov8ors.placement.dto.job;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.List;

import com.codeinnov8ors.placement.entity.JobOpening;
import com.codeinnov8ors.placement.entity.JobSkill;

public record JobResponse(Long id, Long companyId, String companyName, Long placementDriveId, String driveTitle,
		String title, String description, String jobType, String location, String salaryText, BigDecimal minSalary,
		BigDecimal maxSalary, Instant applicationDeadline, String status, BigDecimal minCgpa, String allowedBranches,
		int maxActiveBacklogs, Integer batchYear, Instant postedAt, List<String> skills) {
	public static JobResponse from(JobOpening j, List<JobSkill> jobSkills) {
		return new JobResponse(j.getId(), j.getCompany().getId(), j.getCompany().getName(),
			j.getPlacementDrive() == null ? null : j.getPlacementDrive().getId(),
			j.getPlacementDrive() == null ? null : j.getPlacementDrive().getTitle(), j.getTitle(), j.getDescription(),
			j.getJobType().getDbValue(), j.getLocation(), j.getSalaryText(), j.getMinSalary(), j.getMaxSalary(),
			j.getApplicationDeadline(), j.getStatus().getDbValue(), j.getMinCgpa(), j.getAllowedBranches(),
			j.getMaxActiveBacklogs(), j.getBatchYear(), j.getPostedAt(),
			jobSkills.stream().map(s -> s.getSkill().getSkillName()).toList());
	}
}
