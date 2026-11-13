package com.codeinnov8ors.placement.dto.report;
import java.time.Instant;
public record ApplicationReportRow(Long id, Long studentId, String studentName, Long jobId,
        String jobTitle, Long companyId, String companyName, String status, Instant appliedAt) {}
