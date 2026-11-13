package com.codeinnov8ors.placement.dto.application;

import java.time.Instant;

import com.codeinnov8ors.placement.entity.Application;

public record ApplicationResponse(Long id, Long jobId, String jobTitle, String companyName,
        Long studentId, String studentName, String studentEmail, String status, Instant appliedAt,
        Instant updatedAt, String resumeTitle) {
    public static ApplicationResponse from(Application a) {
        return new ApplicationResponse(a.getId(), a.getJobOpening().getId(), a.getJobOpening().getTitle(),
            a.getJobOpening().getCompany().getName(), a.getStudentProfile().getId(), a.getStudentProfile().getFullName(),
            a.getStudentProfile().getUser().getEmail(), a.getCurrentStatus().getDbValue(), a.getAppliedAt(),
            a.getUpdatedAt(), a.getResume().getTitle());
    }
}
