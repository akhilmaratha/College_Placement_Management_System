package com.codeinnov8ors.placement.repository;

import java.time.Instant;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import com.codeinnov8ors.placement.entity.Application;
import com.codeinnov8ors.placement.entity.Company;
import com.codeinnov8ors.placement.entity.InterviewRound;
import com.codeinnov8ors.placement.entity.JobOpening;
import com.codeinnov8ors.placement.entity.PlacementDrive;
import com.codeinnov8ors.placement.entity.enums.ApplicationStatus;
import com.codeinnov8ors.placement.entity.enums.InterviewRoundStatus;
import com.codeinnov8ors.placement.dto.report.ApplicationReportRow;
import com.codeinnov8ors.placement.dto.report.InterviewReportRow;

public interface ReportRepository extends JpaRepository<Application, Long> {
    interface CompanyReport { Long getCompanyId(); String getCompanyName(); Long getJobCount(); Long getApplicationCount(); Long getShortlistedCount(); Long getSelectedCount(); }
    interface JobReport { Long getJobId(); String getJobTitle(); String getCompanyName(); Long getApplicationCount(); Long getShortlistedCount(); Long getSelectedCount(); }
    interface DriveReport { Long getDriveId(); String getTitle(); String getAcademicYear(); java.time.LocalDate getStartDate(); String getStatus(); Long getJobCount(); Long getApplicationCount(); Long getShortlistedCount(); Long getSelectedCount(); }

    @Query(value="select new com.codeinnov8ors.placement.dto.report.ApplicationReportRow(a.id,s.id,s.fullName,j.id,j.title,c.id,c.name,case a.currentStatus when com.codeinnov8ors.placement.entity.enums.ApplicationStatus.APPLIED then 'Applied' when com.codeinnov8ors.placement.entity.enums.ApplicationStatus.SHORTLISTED then 'Shortlisted' when com.codeinnov8ors.placement.entity.enums.ApplicationStatus.INTERVIEW_SCHEDULED then 'Interview Scheduled' when com.codeinnov8ors.placement.entity.enums.ApplicationStatus.SELECTED then 'Selected' when com.codeinnov8ors.placement.entity.enums.ApplicationStatus.REJECTED then 'Rejected' end,a.appliedAt) from Application a join a.studentProfile s join a.jobOpening j join j.company c where (:from is null or a.appliedAt >= :from) and (:toExclusive is null or a.appliedAt < :toExclusive) and (:companyId is null or c.id = :companyId) and (:jobId is null or j.id = :jobId) and (:status is null or a.currentStatus = :status)",
        countQuery="select count(a) from Application a join a.jobOpening j join j.company c where (:from is null or a.appliedAt >= :from) and (:toExclusive is null or a.appliedAt < :toExclusive) and (:companyId is null or c.id = :companyId) and (:jobId is null or j.id = :jobId) and (:status is null or a.currentStatus = :status)")
    Page<ApplicationReportRow> applications(@Param("from") Instant from,@Param("toExclusive") Instant toExclusive,@Param("companyId") Long companyId,@Param("jobId") Long jobId,@Param("status") ApplicationStatus status,Pageable pageable);

    @Query("select c.id as companyId,c.name as companyName,count(distinct j.id) as jobCount,count(distinct a.id) as applicationCount,count(distinct case when a.currentStatus = :shortlisted then a.id end) as shortlistedCount,count(distinct case when a.currentStatus = :selected then a.id end) as selectedCount from Company c left join JobOpening j on j.company.id=c.id left join Application a on a.jobOpening.id=j.id and (:from is null or a.appliedAt >= :from) and (:toExclusive is null or a.appliedAt < :toExclusive) group by c.id,c.name")
    Page<CompanyReport> companies(@Param("from") Instant from,@Param("toExclusive") Instant toExclusive,@Param("shortlisted") ApplicationStatus shortlisted,@Param("selected") ApplicationStatus selected,Pageable pageable);

    @Query("select j.id as jobId,j.title as jobTitle,c.name as companyName,count(distinct a.id) as applicationCount,count(distinct case when a.currentStatus = :shortlisted then a.id end) as shortlistedCount,count(distinct case when a.currentStatus = :selected then a.id end) as selectedCount from JobOpening j join j.company c left join Application a on a.jobOpening.id=j.id and (:from is null or a.appliedAt >= :from) and (:toExclusive is null or a.appliedAt < :toExclusive) where (:companyId is null or c.id=:companyId) group by j.id,j.title,c.name")
    Page<JobReport> jobs(@Param("from") Instant from,@Param("toExclusive") Instant toExclusive,@Param("companyId") Long companyId,@Param("shortlisted") ApplicationStatus shortlisted,@Param("selected") ApplicationStatus selected,Pageable pageable);

    @Query("select d.id as driveId,d.title as title,d.academicYear as academicYear,d.startDate as startDate,case d.status when com.codeinnov8ors.placement.entity.enums.DriveStatus.UPCOMING then 'Upcoming' when com.codeinnov8ors.placement.entity.enums.DriveStatus.OPEN then 'Open' when com.codeinnov8ors.placement.entity.enums.DriveStatus.IN_PROGRESS then 'In Progress' when com.codeinnov8ors.placement.entity.enums.DriveStatus.CLOSED then 'Closed' end as status,count(distinct j.id) as jobCount,count(distinct a.id) as applicationCount,count(distinct case when a.currentStatus=:shortlisted then a.id end) as shortlistedCount,count(distinct case when a.currentStatus=:selected then a.id end) as selectedCount from PlacementDrive d left join JobOpening j on j.placementDrive.id=d.id left join Application a on a.jobOpening.id=j.id and (:from is null or a.appliedAt>=:from) and (:toExclusive is null or a.appliedAt<:toExclusive) group by d.id,d.title,d.academicYear,d.startDate,d.status")
    Page<DriveReport> drives(@Param("from") Instant from,@Param("toExclusive") Instant toExclusive,@Param("shortlisted") ApplicationStatus shortlisted,@Param("selected") ApplicationStatus selected,Pageable pageable);

    @Query(value="select new com.codeinnov8ors.placement.dto.report.InterviewReportRow(i.id,a.id,s.fullName,j.id,j.title,c.id,c.name,i.roundNumber,i.roundName,i.scheduledAt,case i.status when com.codeinnov8ors.placement.entity.enums.InterviewRoundStatus.SCHEDULED then 'Scheduled' when com.codeinnov8ors.placement.entity.enums.InterviewRoundStatus.COMPLETED then 'Completed' when com.codeinnov8ors.placement.entity.enums.InterviewRoundStatus.RESCHEDULED then 'Rescheduled' when com.codeinnov8ors.placement.entity.enums.InterviewRoundStatus.CANCELLED then 'Cancelled' when com.codeinnov8ors.placement.entity.enums.InterviewRoundStatus.NO_SHOW then 'No Show' end,case i.result when com.codeinnov8ors.placement.entity.enums.InterviewResult.PENDING then 'Pending' when com.codeinnov8ors.placement.entity.enums.InterviewResult.CLEARED then 'Cleared' when com.codeinnov8ors.placement.entity.enums.InterviewResult.NOT_CLEARED then 'Not Cleared' when com.codeinnov8ors.placement.entity.enums.InterviewResult.ON_HOLD then 'On Hold' end) from InterviewRound i join i.application a join a.studentProfile s join a.jobOpening j join j.company c where (:from is null or i.scheduledAt >= :from) and (:toExclusive is null or i.scheduledAt < :toExclusive) and (:companyId is null or c.id=:companyId) and (:jobId is null or j.id=:jobId) and (:status is null or i.status=:status)",
        countQuery="select count(i) from InterviewRound i join i.application a join a.jobOpening j join j.company c where (:from is null or i.scheduledAt >= :from) and (:toExclusive is null or i.scheduledAt < :toExclusive) and (:companyId is null or c.id=:companyId) and (:jobId is null or j.id=:jobId) and (:status is null or i.status=:status)")
    Page<InterviewReportRow> interviews(@Param("from") Instant from,@Param("toExclusive") Instant toExclusive,@Param("companyId") Long companyId,@Param("jobId") Long jobId,@Param("status") InterviewRoundStatus status,Pageable pageable);

    @Query("select count(a) from Application a where (:from is null or a.appliedAt>=:from) and (:toExclusive is null or a.appliedAt<:toExclusive)") long applicationCount(@Param("from") Instant from,@Param("toExclusive") Instant toExclusive);
    @Query("select count(a) from Application a where a.currentStatus=:status and (:from is null or a.appliedAt>=:from) and (:toExclusive is null or a.appliedAt<:toExclusive)") long applicationStatusCount(@Param("status") ApplicationStatus status,@Param("from") Instant from,@Param("toExclusive") Instant toExclusive);
    @Query("select count(i) from InterviewRound i where (:from is null or i.scheduledAt>=:from) and (:toExclusive is null or i.scheduledAt<:toExclusive)") long interviewCount(@Param("from") Instant from,@Param("toExclusive") Instant toExclusive);
}
