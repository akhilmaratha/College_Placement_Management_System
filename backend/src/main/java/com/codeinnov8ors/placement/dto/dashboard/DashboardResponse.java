package com.codeinnov8ors.placement.dto.dashboard;

import java.time.Instant;
import java.time.LocalDate;
import java.util.List;

public record DashboardResponse(String displayName, String companyName, boolean profileComplete,
        DashboardStats summary, List<DashboardJob> recentJobs, List<DashboardApplication> recentApplications,
        List<DashboardInterview> upcomingInterviews, List<DashboardDrive> upcomingDrives,
        List<DashboardUser> recentUsers) {
    public record DashboardStats(long totalUsers, long totalStudents, long totalRecruiters, long totalCompanies,
            long totalJobs, long activeJobs, long closedJobs, long totalDrives, long activeDrives,
            long totalApplications, long applicationsUnderReview, long shortlistedApplications,
            long rejectedApplications, long selectedApplications, long upcomingInterviews, long availableJobs) {}
    public record DashboardJob(Long id, String title, String status, Instant deadline, String companyName, long applicantCount) {}
    public record DashboardApplication(Long id, Long jobId, String jobTitle, String companyName,
            String studentName, String status, Instant appliedAt) {}
    public record DashboardInterview(Long id, Long applicationId, Long jobId, String jobTitle,
            String companyName, String studentName, int roundNumber, String roundName,
            Instant scheduledAt, String status) {}
    public record DashboardDrive(Long id, String title, LocalDate startDate, LocalDate endDate, String status) {}
    public record DashboardUser(Long id, String role, String status, Instant createdAt) {}
}
