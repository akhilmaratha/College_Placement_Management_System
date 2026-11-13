package com.codeinnov8ors.placement.dto.report;
public record PlacementSummaryReport(long totalStudents, long totalCompanies, long publishedJobs,
        long activeDrives, long applications, long shortlistedApplications, long selectedApplications,
        long interviews, long completedInterviews) {}
