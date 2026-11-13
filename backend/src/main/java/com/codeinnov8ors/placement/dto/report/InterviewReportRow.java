package com.codeinnov8ors.placement.dto.report;
import java.time.Instant;
public record InterviewReportRow(Long id, Long applicationId, String studentName, Long jobId,
        String jobTitle, Long companyId, String companyName, int roundNumber, String roundName,
        Instant scheduledAt, String status, String result) {}
