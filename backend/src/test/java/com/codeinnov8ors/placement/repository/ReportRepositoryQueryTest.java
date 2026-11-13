package com.codeinnov8ors.placement.repository;

import static org.junit.jupiter.api.Assertions.assertEquals;

import java.time.Instant;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.data.jpa.test.autoconfigure.DataJpaTest;
import org.springframework.data.domain.PageRequest;
import org.springframework.test.context.ActiveProfiles;
import com.codeinnov8ors.placement.entity.enums.ApplicationStatus;
import com.codeinnov8ors.placement.entity.enums.InterviewRoundStatus;

@DataJpaTest
@ActiveProfiles("datajpa")
class ReportRepositoryQueryTest {
    @Autowired ReportRepository reports;

    @Test void aggregateAndPaginatedQueriesReturnEmptyResultsForEmptyDatabase() {
        var pageable=PageRequest.of(0,20);
        assertEquals(0,reports.applications(null,null,null,null,null,pageable).getTotalElements());
        assertEquals(0,reports.companies(null,null,ApplicationStatus.SHORTLISTED,ApplicationStatus.SELECTED,pageable).getTotalElements());
        assertEquals(0,reports.jobs(null,null,null,ApplicationStatus.SHORTLISTED,ApplicationStatus.SELECTED,pageable).getTotalElements());
        assertEquals(0,reports.drives(null,null,ApplicationStatus.SHORTLISTED,ApplicationStatus.SELECTED,pageable).getTotalElements());
        assertEquals(0,reports.interviews(null,null,null,null,null,pageable).getTotalElements());
        assertEquals(0,reports.applicationCount(null,null));
        assertEquals(0,reports.applicationStatusCount(ApplicationStatus.SELECTED,null,null));
        assertEquals(0,reports.interviewCount(null,null));
        assertEquals(0,reports.interviews(null,null,null,null,InterviewRoundStatus.COMPLETED,PageRequest.of(0,1)).getTotalElements());
        Instant from=Instant.parse("2026-01-01T00:00:00Z"), to=Instant.parse("2027-01-01T00:00:00Z");
        assertEquals(0,reports.applications(from,to,1L,2L,ApplicationStatus.SHORTLISTED,pageable).getTotalElements());
        assertEquals(0,reports.companies(from,to,ApplicationStatus.SHORTLISTED,ApplicationStatus.SELECTED,pageable).getTotalElements());
        assertEquals(0,reports.jobs(from,to,1L,ApplicationStatus.SHORTLISTED,ApplicationStatus.SELECTED,pageable).getTotalElements());
        assertEquals(0,reports.drives(from,to,ApplicationStatus.SHORTLISTED,ApplicationStatus.SELECTED,pageable).getTotalElements());
        assertEquals(0,reports.interviews(from,to,1L,2L,InterviewRoundStatus.COMPLETED,pageable).getTotalElements());
    }
}
