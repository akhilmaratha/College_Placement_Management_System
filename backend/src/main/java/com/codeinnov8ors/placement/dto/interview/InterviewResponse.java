package com.codeinnov8ors.placement.dto.interview;

import java.time.Instant;
import com.codeinnov8ors.placement.entity.InterviewRound;

public record InterviewResponse(Long id, Long applicationId, Long jobId, String jobTitle,
        String companyName, Long studentId, String studentName, String studentEmail,
        int roundNumber, String roundName, Instant scheduledAt, int durationMinutes,
        String interviewMode, String venueOrLink, String interviewerName, String status,
        String result, String feedback, Instant createdAt, Instant updatedAt) {
    public static InterviewResponse from(InterviewRound i, boolean includeFeedback) {
        var a = i.getApplication();
        return new InterviewResponse(i.getId(), a.getId(), a.getJobOpening().getId(), a.getJobOpening().getTitle(),
            a.getJobOpening().getCompany().getName(), a.getStudentProfile().getId(), a.getStudentProfile().getFullName(),
            a.getStudentProfile().getUser().getEmail(), i.getRoundNumber(), i.getRoundName(), i.getScheduledAt(),
            i.getDurationMinutes(), i.getInterviewMode().getDbValue(), i.getVenueOrLink(), i.getInterviewerName(),
            i.getStatus().getDbValue(), i.getResult().getDbValue(), includeFeedback ? i.getFeedback() : null,
            i.getCreatedAt(), i.getUpdatedAt());
    }
}
